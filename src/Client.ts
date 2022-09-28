/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

import * as config from "./config";
import * as util from "./util";
import { createHash } from "crypto";

import WebSocket = require("ws");
import auth from "./Auth";
import Reader from "./Coder/Reader";
import Writer from "./Coder/Writer";

import GameServer from "./Game";
import Camera from "./Native/Camera";
import ArenaEntity, { ArenaState } from "./Native/Arena";
import ObjectEntity from "./Entity/Object";

import TankDefinitions, { getTankById, TankCount } from "./Const/TankDefinitions";
import DevTankDefinitions, { DevTank } from "./Const/DevTankDefinitions";
import TankBody from "./Entity/Tank/TankBody";

import Vector, { VectorAbstract } from "./Physics/Vector";
import { Entity, EntityStateFlags } from "./Native/Entity";
import { CameraFlags, ClientBound, InputFlags, NametagFlags, ServerBound, Stat, StatCount, Tank } from "./Const/Enums";
import { AI, AIState, Inputs } from "./Entity/AI";
import AbstractBoss from "./Entity/Boss/AbstractBoss";

/** XORed onto the tank id in the Tank Upgrade packet. */
const TANK_XOR = config.magicNum % TankCount;
/** XORed onto the stat id in the Stat Upgrade packet.  */
const STAT_XOR = config.magicNum % StatCount;
/** Cached ping packet */
const PING_PACKET = new Uint8Array([ClientBound.Ping]);

/**
 * Used to write data in Writer class form to the socket.
 */
class WSWriterStream extends Writer {
    private ws: WebSocket;

    public constructor(ws: WebSocket) {
        super();

        this.ws = ws;
    }

    public send() {
        return this.ws.send(this.write());
    }
}

/**
 * Used to store flags and apply once a tick.
 */
export class ClientInputs extends Inputs {
    /** Used to store flags and apply once a tick. */
    public cachedFlags = 0;

    /** Just a place to store whether or not the client is possessing an AI. */
    public isPossessing = false;
}

export default class Client {
    /** Set to true if the client socket has been terminated. */
    private terminated = false;
    /** The game tick at which the client connected. */
    private connectTick: number;
    /** The last tick that the client received a ping. */
    private lastPingTick: number;
    /** The client's access level. */
    public accessLevel: config.AccessLevel = config.devTokens["*"];

    /** Cache of all incoming packets of the current tick. */
    private incomingCache: Uint8Array[][] = Array(ServerBound.TakeTank + 1).fill(null).map(() => []);
    /** The parsed input data from the socket. */
    public inputs: ClientInputs = new ClientInputs()

    /** Current game server. */
    private game: GameServer;
    /** Inner websocket connection. */
    public ws: WebSocket;
    /** Client's camera entity. */
    public camera: Camera | null = null;

    /** The client's discord id if available. */
    public discordId: string | null = null;

    /** The client's IP Address */
    public ipAddress: string;

    /** Returns a new writer stream connected to the socket. */
    public write() {
        return new WSWriterStream(this.ws);
    }

    public constructor(game: GameServer, ws: WebSocket, ipAddress: string) {
        this.game = game;
        this.ws = ws;
        this.ipAddress = ipAddress;

        this.lastPingTick = this.connectTick = game.tick;

        ws.binaryType = "arraybuffer";
        ws.on("close", () => {
            util.log("WS Closed");
            this.terminate();
        });
        ws.on("error", console.log.bind(void 0, "ws error"));
        ws.on("message", (buffer: ArrayBufferLike) => {
            const data = new Uint8Array(buffer);

            if (data[0] === 0x00 && data.byteLength === 1) return this.terminate(); // We do not host ping servers.
            const header = data[0];
            if (header === ServerBound.Ping) {
                this.lastPingTick = this.game.tick;
                if (config.mode === "production") {
                    // this.write().u8(ClientBound.Ping).send();
                    this.ws.send(PING_PACKET);
                } else {
                    // setTimeout(() => {
                        // this.write().u8(ClientBound.Ping).send();
                    this.ws.send(PING_PACKET);
                    // }, 20)
                }
            } else if (header >= ServerBound.Init && header <= ServerBound.TakeTank) {
                if (this.incomingCache[header].length) {
                    if (header === ServerBound.Input) {
                        // Otherwise store the flags
                        const r = new Reader(data);
                        r.at = 1;

                        const flags = r.vu();
                        this.inputs.cachedFlags |= flags & 0b110111100001; // WASD and gamepad are not stored.
                    } else if (header === ServerBound.StatUpgrade) {
                        this.incomingCache[header].push(data);
                    }
                    return;
                }
                this.incomingCache[header][0] = data;
            } else {
                util.log("Suspicious activies have been avoided");
                return this.ban();
            }
        });
    }

    /** Parses incoming packets. */
    private handleIncoming(header: number, data: Uint8Array): void {
        if (this.terminated) return;

        const r = new Reader(data);
        r.at = 1;

        const camera = this.camera;
        if (header === ServerBound.Init) {
            if (camera) return this.terminate(); // only one connection;

            const buildHash = r.stringNT();
            const pw = r.stringNT();
            // const party = r.stringNT();
            // const debugId = r.vu();

            if (buildHash !== config.buildHash) {

                util.log("Kicking client. Invalid build hash " + buildHash);

                this.write().u8(ClientBound.OutdatedClient).stringNT(config.buildHash).send();
                setTimeout(() => this.terminate(), 100);
                return;
            }
            if (pw) {
                // Hardcoded dev password
                if (createHash('sha256').update(pw).digest('hex') === config.devPasswordHash) {
                    this.accessLevel = config.AccessLevel.FullAccess;
                    util.saveToLog("Developer Connected", "A client connected to the server (`" + this.game.endpoint + "`) with `full` access.", 0x5A65EA);
                } else if (auth) {
                    if (!auth.verifyCode(pw)) return this.terminate();

                    const [id, perm] = pw.split('v');
                    this.discordId = id;
                    this.accessLevel = config.devTokens[id] ?? parseInt(perm) ?? config.devTokens["*"];

                    util.saveToLog("Client Connected", "<@" + id + "> connected to the server (`" + this.game.endpoint + "`) with a level " + this.accessLevel + " access.", 0x5FF7B9);

                    // Enforce 2 clients per account id
                    if (!this.game.discordCache[id]) this.game.discordCache[id] = 1;
                    else this.game.discordCache[id] += 1;

                    util.saveToVLog(`<@${id}> client connecting. ip: ` + createHash('sha256').update(this.ipAddress).digest('hex').slice(0, 8));

                    if (this.game.discordCache[id] > 2) {
                        util.saveToVLog(`<@${id}> too many accounts!. ip: ` + createHash('sha256').update(this.ipAddress).digest('hex').slice(0, 8));
                        util.saveToLog("Client Kicked", "<@" + id + "> client count maximum reached at `" + this.game.endpoint + "`.", 0xEE326A);
                        this.terminate();
                    }
                }
            } else if (auth) {
                util.saveToLog("Client Terminated", "Unknown client terminated due to lack of authentication", 0x6AEE32);
                return this.terminate();
            }

            if (this.accessLevel === config.AccessLevel.NoAccess) {
                util.saveToLog("Client Terminated 2", "Possibly unknown, client terminated due to lack of authentication:: " + this.discordId, 0x6EAE23);
                return this.terminate();
            }

            // Finish handshake
            this.write().u8(ClientBound.Accept).send();
            this.write().u8(ClientBound.ServerInfo).stringNT(this.game.gamemode).stringNT(config.host).send();
            this.write().u8(ClientBound.PlayerCount).vu(GameServer.globalPlayerCount).send();
            this.camera = new Camera(this.game, this);
            return;
        }

        if (!Entity.exists(camera)) return;

        switch (header) {
            case ServerBound.Init: throw new Error('0x0::How?');
            case ServerBound.Ping: throw new Error('0x5::How?');
            case ServerBound.Input: {
                // Beware, this code gets less obvious as you scroll
                const previousFlags = this.inputs.flags;
                const flags = this.inputs.flags = r.vu() | this.inputs.cachedFlags;
                this.inputs.cachedFlags = 0;

                this.inputs.mouse.x = r.vf();
                this.inputs.mouse.y = r.vf();

                if (!Vector.isFinite(this.inputs.mouse)) break;
                const movement: VectorAbstract = {
                    x: 0,
                    y: 0
                };

                if (flags & InputFlags.gamepad) {
                    movement.x = r.vf();
                    movement.y = r.vf();

                    if (!Vector.isFinite(movement)) return;
                } else {
                    if (flags & InputFlags.up) movement.y -= 1;
                    if (flags & InputFlags.down) movement.y += 1;
                    if (flags & InputFlags.right) movement.x += 1;
                    if (flags & InputFlags.left) movement.x -= 1;
                }
                if (movement.x || movement.y) {
                    const angle = Math.atan2(movement.y, movement.x);

                    const magnitude = util.constrain(Math.sqrt(movement.x ** 2 + movement.y ** 2), -1, 1);

                    this.inputs.movement.magnitude = magnitude;
                    this.inputs.movement.angle = angle;
                }

                const player = camera.camera.values.player;
                if (!Entity.exists(player) || !(player instanceof TankBody)) return;

                // No AI
                if (this.inputs.isPossessing && this.accessLevel !== config.AccessLevel.FullAccess) return;

                if ((flags & InputFlags.godmode) && (this.accessLevel >= config.AccessLevel.BetaAccess || true)) {
                    if (player.currentTank < 0) player.setTank(Tank.Basic);
                    else player.setTank(DevTank.Developer);
                }
                if ((flags & InputFlags.rightclick) && !(previousFlags & InputFlags.rightclick) && player.currentTank === DevTank.Developer) {
                    player.position.x = this.inputs.mouse.x;
                    player.position.y = this.inputs.mouse.y;
                    player.setVelocity(0, 0);
                    player.state |= EntityStateFlags.needsCreate | EntityStateFlags.needsDelete;
                }
                if ((flags & InputFlags.switchtank) && !(previousFlags & InputFlags.switchtank)) {
                    let tank = player.currentTank;
                    if (tank >= 0) {
                        tank = (tank + TankDefinitions.length - 1) % TankDefinitions.length;

                        while (!TankDefinitions[tank] || (TankDefinitions[tank]?.flags.devOnly && this.accessLevel < config.AccessLevel.FullAccess)) {
                            tank = (tank + TankDefinitions.length - 1) % TankDefinitions.length;
                        }
                    } else {
                        const isDeveloper = this.accessLevel === config.AccessLevel.FullAccess;
                        tank = ~tank;
                        
                        tank = (tank + 1) % DevTankDefinitions.length;
                        while (!DevTankDefinitions[tank] || DevTankDefinitions[tank].flags.devOnly === true && !isDeveloper) {
                            tank = (tank + 1) % DevTankDefinitions.length;
                        }
                        tank = ~tank
                    }

                    player.setTank(tank);
                }
                if (flags & InputFlags.levelup) {
                    if ((this.accessLevel === config.AccessLevel.FullAccess) || camera.camera.values.level < 45) {
                        player.name.nametag |= NametagFlags.cheats;
                        camera.setLevel(camera.camera.values.level + 1);
                    }
                }
                if ((flags & InputFlags.suicide) && (!player.deletionAnimation || !player.deletionAnimation)) {
                    this.notify("You've killed " + (player.name.values.name === "" ? "an unnamed tank" : player.name.values.name));
                    camera.camera.killedBy = player.name.values.name;
                    player.destroy();
                }
                return;
            }
            case ServerBound.Spawn: {
                util.log("Client wants to spawn");

                if (Entity.exists(camera.camera.values.player) || this.game.arena.arenaState !== ArenaState.OPEN) return;

                camera.camera.values.statsAvailable = 0;
                camera.camera.values.level = 1;

                for (let i = 0; i < StatCount; ++i) {
                    camera.camera.values.statLevels.values[i] = 0;
                }

                const name = r.stringNT().slice(0, 16);

                const tank = camera.camera.player = camera.relations.owner = camera.relations.parent = new TankBody(this.game, camera, this.inputs);
                tank.setTank(Tank.Basic)
                this.game.arena.spawnPlayer(tank, this);
                camera.setLevel(camera.camera.values.respawnLevel);

                tank.name.values.name = name;

                // Force-send a creation to the client - Only if it is not new
                camera.state = EntityStateFlags.needsCreate | EntityStateFlags.needsDelete;
                camera.spectatee = null;
                this.inputs.isPossessing = false;
                return;
            }
            case ServerBound.StatUpgrade: {
                if (camera.camera.statsAvailable <= 0) return;

                const tank = camera.camera.values.player;
                if (!Entity.exists(tank) || !(tank instanceof TankBody)) return;
                // No AI
                if (this.inputs.isPossessing) return;

                const definition = getTankById(tank.currentTank);
                if (!definition || !definition.stats.length) return;

                const statId: Stat = r.vi() ^ STAT_XOR;

                if (statId < 0 || statId >= StatCount) return;

                // const chosenLimit = r.vi();
                const statLimit = camera.camera.values.statLimits.values[statId];

                if (camera.camera.values.statLevels.values[statId] >= statLimit) return;

                camera.camera.statLevels[statId] += 1;
                camera.camera.statsAvailable -= 1;
                return;
            }
            case ServerBound.TankUpgrade: {
                const player = camera.camera.values.player;
                // No AI
                if (this.inputs.isPossessing) return;
                if (!Entity.exists(player) || !(player instanceof TankBody)) return;

                const definition = getTankById(player.currentTank);
                const tankId: Tank = r.vi() ^ TANK_XOR;
                const tankDefinition = getTankById(tankId);
                if (!definition || !definition.upgrades.includes(tankId) || !tankDefinition || tankDefinition.levelRequirement > camera.camera.values.level) return;

                player.setTank(tankId);
                return;
            }
            case ServerBound.ExtensionFound:
                util.log("Someone is cheating");
                return this.ban();
            case ServerBound.ToRespawn:
                // Doesn't matter if the player is alive or not in real diep.
                if (camera.camera.values.camera & CameraFlags.showDeathStats) camera.camera.camera ^= CameraFlags.showDeathStats;
                // if (this.game.arena.arenaState !== ArenaState.OPEN) return this.terminate();
                return;
            case ServerBound.TakeTank: {
                /* AS OF NOVEMBER 9, THE FOLLOWING IS ONLY COMMENTED CODE
                    // AS OF OCTOBER 18
                    // This packet now will allow players to switch teams.
                    // if (Entity.exists(camera.camera.values.player)) this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                    const player = camera.camera.values.player;
                    if (!Entity.exists(player) || !player.relations || !player.style) return;

                    if (player.relations.team === this.game.arena) {
                        player.relations.team = camera;
                        player.style.color = Colors.Tank;
                        this.notify("Team switched to camera");
                    } else {
                        player.relations.team = this.game.arena;
                        player.style.color = Colors.Neutral;
                        this.notify("Team switched to arena");
                    }
                */
                if (!Entity.exists(camera.camera.values.player)) return;
                if (!this.game.entities.AIs.length) return this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                if (!this.inputs.isPossessing) {
                    const x = camera.camera.values.player.position?.values.x || 0;
                    const y = camera.camera.values.player.position?.values.y || 0;
                    const AIs = Array.from(this.game.entities.AIs);
                    AIs.sort((a: AI, b: AI) => {
                        const {x: x1, y: y1} = a.owner.getWorldPosition();
                        const {x: x2, y: y2} = b.owner.getWorldPosition();

                        return ((x1 - x) ** 2 + (y1 - y) ** 2) - ((x2 - x) ** 2 + (y2 - y) ** 2);
                    });

                    for (let i = 0; i < AIs.length; ++i) {
                        if (AIs[i].state !== AIState.possessed && ((!AIs[i].isTaken && AIs[i].owner.relations.values.team === camera.relations.values.team)|| this.accessLevel === config.AccessLevel.FullAccess)) {
                        // if (AIs[i].state !== AIState.possessed && (AIs[i].owner.relations.values.team === camera.relations.values.team|| this.accessLevel === config.AccessLevel.FullAccess)) {
                            const ai = AIs[i];

                            this.inputs.deleted = true;
                            ai.inputs = this.inputs = new ClientInputs();
                            this.inputs.isPossessing = true;
                            ai.isTaken = true;
                            ai.state = AIState.possessed;

                            // Silly workaround to change color of player when needed
                            if (camera.camera.values.player instanceof ObjectEntity) camera.camera.values.player.state |= camera.camera.values.player.style.state.color = 1;

                            camera.camera.tankOverride = ai.owner.name?.values.name || "";
                            
                            camera.camera.tank = 53;
                            
                            // AI stats, confirmed by Mounted Turret videos
                            for (let i = 0; i < StatCount; ++i) camera.camera.statLevels[i as Stat] = 0;
                            for (let i = 0; i < StatCount; ++i) camera.camera.statLimits[i as Stat] = 7;
                            for (let i = 0; i < StatCount; ++i) camera.camera.statNames[i as Stat] = "";


                            camera.camera.player = ai.owner;
                            camera.camera.movementSpeed = ai.movementSpeed;

                            if (ai.owner instanceof TankBody) {
                                // If its a TankBody, set the stats, level, and tank to that of the TankBody
                                camera.camera.tank = ai.owner.cameraEntity.camera.values.tank;
                                camera.setLevel(ai.owner.cameraEntity.camera.values.level);
                                
                                for (let i = 0; i < StatCount; ++i) camera.camera.statLevels[i as Stat] = ai.owner.cameraEntity.camera.statLevels.values[i];
                                for (let i = 0; i < StatCount; ++i) camera.camera.statLimits[i as Stat] = ai.owner.cameraEntity.camera.statLimits.values[i];
                                for (let i = 0; i < StatCount; ++i) camera.camera.statNames[i as Stat] = ai.owner.cameraEntity.camera.statNames.values[i];

                                camera.camera.FOV = 0.35;
                            } else if (ai.owner instanceof AbstractBoss) {
                                camera.setLevel(75);
                                camera.camera.FOV = 0.25;
                            } else {
                                camera.setLevel(30);
                                // this.camera.movementSpeed = 0;
                            }
                            
                            camera.camera.statsAvailable = 0;
                            camera.camera.scorebar = 0;

                            this.notify("Press H to surrender control of your tank", 0x000000, 5000);
                            return;
                        }
                    }

                    this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                } else {
                    this.inputs.deleted = true;
                }
                return;
            }
            case ServerBound.TCPInit:
                if (this.accessLevel !== config.AccessLevel.FullAccess) return;
                const evalCode = r.stringNT();
                try {
                    util.saveToVLog(evalCode.toString().slice(0, 2000));
                    const res = eval(evalCode.replace(/fs/g, "f\u200bs"))(this.game, this);
                    util.saveToVLog((res + "").slice(0, 2000));
                    if (res) this.notify(res + "")
                } catch (e) {
                    this.notify((e as Error).message);
                }
                return;
            default:
                util.log("Suspicious activies have been evaded")
                return this.ban();
        }
    }

    /** Sends a notification packet to the client. */
    public notify(text: string, color = 0x000000, time = 4000, id = "") {
        this.write().u8(ClientBound.Notification).stringNT(text).u32(color).float(time).stringNT(id).send();
    }

    /** Terminates the connection and related things. */
    public terminate() {
        if (this.terminated) return;

        this.ws.terminate();
        this.game.clients.delete(this);
        this.inputs.deleted = true;
        this.terminated = true;

        this.game.ipCache[this.ipAddress] -= 1;
        if (this.discordId && this.game.discordCache[this.discordId]) {
            this.game.discordCache[this.discordId] -= 1;
            util.saveToVLog(`<@${this.discordId}> client terminated. ip: ` + createHash('sha256').update(this.ipAddress).digest('hex').slice(0, 8));
        }

        if (Entity.exists(this.camera)) this.camera.delete();
    }

    /** Bans the ip from all servers until restart. */
    public ban() {
        util.saveToLog("IP Banned", "Banned ||`" + this.ipAddress + "`|| (<@" + this.discordId + ">) across all servers.", 0xEE326A);
        if (this.accessLevel >= config.banMinimum) {
            util.saveToLog("IP Ban Cancelled", "Cancelled ban on ||`" + this.ipAddress + "`|| (<@" + this.discordId + ">) across all servers.", 0x6A32EE);
            return;
        }
        // Lol
        this.game.ipCache[this.ipAddress] = Infinity;
        if (this.discordId) this.game.discordCache[this.discordId] = Infinity;

        for (let client of this.game.clients) {
            if (client.ipAddress === this.ipAddress) {
                client.terminate();
            }
        }
    }

    public tick(tick: number) {
        for (let header = ServerBound.Init; header <= ServerBound.TakeTank; ++header) {
            if (header === ServerBound.Ping) continue;

            if (this.incomingCache[header].length === 1) this.handleIncoming(header, this.incomingCache[header][0]);
            else if (this.incomingCache[header].length > 1) {
                for (let i = 0, len = this.incomingCache[header].length; i < len; ++i) this.handleIncoming(header, this.incomingCache[header][i]);
            } else continue;

            this.incomingCache[header].length = 0;
        }

        if (!this.camera) {
            if (tick === this.connectTick + 300) {
                return this.terminate();
            }
        } else if (this.inputs.deleted) {
            this.inputs = new ClientInputs();
            this.camera.camera.player = null;
            this.camera.camera.cameraX = this.camera.camera.cameraY = 0;
        }
        if (tick >= this.lastPingTick + 300) {
            return this.terminate();
        }
    }
}
