import Client from "../Client"
import { AccessLevel } from "../config";
import AbstractBoss from "../Entity/Boss/AbstractBoss";
import Defender from "../Entity/Boss/Defender";
import FallenBooster from "../Entity/Boss/FallenBooster";
import FallenOverlord from "../Entity/Boss/FallenOverlord";
import Guardian from "../Entity/Boss/Guardian";
import Summoner from "../Entity/Boss/Summoner";
import LivingEntity from "../Entity/Live";
import ArenaCloser from "../Entity/Misc/ArenaCloser";
import FallenAC from "../Entity/Misc/Boss/FallenAC";
import FallenSpike from "../Entity/Misc/Boss/FallenSpike";
import Dominator from "../Entity/Misc/Dominator";
import ObjectEntity from "../Entity/Object";
import AbstractShape from "../Entity/Shape/AbstractShape";
import Crasher from "../Entity/Shape/Crasher";
import Pentagon from "../Entity/Shape/Pentagon";
import Square from "../Entity/Shape/Square";
import Triangle from "../Entity/Shape/Triangle";
import AutoTurret from "../Entity/Tank/AutoTurret";
import Bullet from "../Entity/Tank/Projectile/Bullet";
import TankBody from "../Entity/Tank/TankBody";
import { Entity, EntityStateFlags } from "../Native/Entity";
import { saveToVLog } from "../util";
import { Stat, StatCount, StyleFlags } from "./Enums";
import { getTankByName } from "./TankDefinitions"

export const enum CommandID {
    gameSetTank = "game_set_tank",
    gameSetLevel = "game_set_level",
    gameSetScore = "game_set_score",
    gameSetStat = "game_set_stat",
    gameSetStatMax = "game_set_stat_max",
    gameAddUpgradePoints = "game_add_upgrade_points",
    gameTeleport = "game_teleport",
    gameClaim = "game_claim",
    adminGodmode = "admin_godmode",
    adminSummon= "admin_summon",
    adminKillAll = "admin_kill_all",
    adminKillEntity = "admin_kill_entity",
    adminCloseArena = "admin_close_arena"
}

export interface CommandDefinition {
    id: CommandID,
    usage?: string,
    description?: string,
    permissionLevel: AccessLevel,
}

export interface CommandCallback {
    (client: Client, ...args: string[]): void 
}

export const commandDefinitions = {
    game_set_tank: {
        id: CommandID.gameSetTank,
        usage: "[tank]",
        description: "Changes your tank to the given class",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_set_level: {
        id: CommandID.gameSetLevel,
        usage: "[level]",
        description: "Changes your level to the given whole number",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_set_score: {
        id: CommandID.gameSetScore,
        usage: "[score]",
        description: "Changes your score to the given whole number",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_set_stat: {
        id: CommandID.gameSetStat,
        usage: "[stat num] [points]",
        description: "Set the value of one of your statuses. Values can be greater than the capacity. [stat num] is equivalent to the number that appears in the UI",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_set_stat_max: {
        id: CommandID.gameSetStatMax,
        usage: "[stat num] [max]",
        description: "Set the max value of one of your statuses. [stat num] is equivalent to the number that appears in the UI",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_add_upgrade_points: {
        id: CommandID.gameAddUpgradePoints,
        usage: "[points]",
        description: "Add upgrade points",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_teleport: {
        id: CommandID.gameTeleport,
        usage: "[x] [y]",
        description: "Teleports you to the given position",
        permissionLevel: AccessLevel.BetaAccess
    },
    game_claim: {
        id: CommandID.gameClaim,
        usage: "[entityName]",
        description: "Attempts claiming an entity of the given type",
        permissionLevel: AccessLevel.BetaAccess
    },
    admin_godmode: {
        id: CommandID.adminGodmode,
        usage: "[?activate]",
        description: "Toggles godmode, if given an activate argument (on / off) sets it instead",
        permissionLevel: AccessLevel.FullAccess
    },
    admin_summon: {
        id: CommandID.adminSummon,
        usage: "[entityName] [?count] [?x] [?y]",
        description: "Spawns entities at a certain location",
        permissionLevel: AccessLevel.FullAccess
    },
    admin_kill_all: {
        id: CommandID.adminKillAll,
        description: "Kills all entities in the arena",
        permissionLevel: AccessLevel.FullAccess
    },
    admin_kill_entity: {
        id: CommandID.adminKillEntity,
        usage: "[entityName]",
        description: "Kills all entities of the given type (might include self)",
        permissionLevel: AccessLevel.FullAccess
    },
    admin_close_arena: {
        id: CommandID.adminCloseArena,
        description: "Closes the current arena",
        permissionLevel: AccessLevel.FullAccess
    }
} as Record<CommandID, CommandDefinition>

export const commandCallbacks = {
    game_set_tank: (client: Client, tankNameArg: string) => {
        const tankDef = getTankByName(tankNameArg);
        const player = client.camera?.cameraData.player;
        if (!tankDef || !Entity.exists(player) || !(player instanceof TankBody)) return;
        player.setTank(tankDef.id);
    },
    game_set_level: (client: Client, levelArg: string) => {
        const level = parseInt(levelArg);
        const player = client.camera?.cameraData.player;
        if (isNaN(level) || !Entity.exists(player) || !(player instanceof TankBody)) return;
        client.camera?.setLevel(level);
    },
    game_set_score: (client: Client, scoreArg: string) => {
        const score = parseInt(scoreArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (isNaN(score) || score > Number.MAX_SAFE_INTEGER || score < Number.MIN_SAFE_INTEGER || !Entity.exists(player) || !(player instanceof TankBody) || !camera) return;
        camera.score = score;
    },
    game_set_stat_max: (client: Client, statIdArg: string, statMaxArg: string) => {
        const statId = StatCount - parseInt(statIdArg);
        const statMax = parseInt(statMaxArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (statId < 0 || statId >= StatCount || isNaN(statId) || isNaN(statMax) || !Entity.exists(player) || !(player instanceof TankBody) || !camera) return;
        const clampedStatMax = Math.max(statMax, 0);
        camera.statLimits[statId as Stat] = clampedStatMax;
        camera.statLevels[statId as Stat] = Math.min(camera.statLevels[statId as Stat], clampedStatMax);
    },
    game_set_stat: (client: Client, statIdArg: string, statPointsArg: string) => {
        const statId = StatCount - parseInt(statIdArg);
        const statPoints = parseInt(statPointsArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (statId < 0 || statId >= StatCount || isNaN(statId) || isNaN(statPoints) || !Entity.exists(player) || !(player instanceof TankBody) || !camera) return;
        camera.statLevels[statId as Stat] = statPoints;
    },
    game_add_upgrade_points: (client: Client, pointsArg: string) => {
        const points = parseInt(pointsArg);
        const camera = client.camera?.cameraData;
        const player = client.camera?.cameraData.player;
        if (isNaN(points) || points > Number.MAX_SAFE_INTEGER || points < Number.MIN_SAFE_INTEGER || !Entity.exists(player) || !(player instanceof TankBody) || !camera) return;
        camera.statsAvailable += points;
    },
    game_teleport: (client: Client, xArg: string, yArg: string) => {
        const x = parseInt(xArg);
        const y = parseInt(yArg);
        const player = client.camera?.cameraData.player;
        if (isNaN(x) || isNaN(y) || !Entity.exists(player) || !(player instanceof TankBody)) return;
        player.positionData.x = x;
        player.positionData.y = y;
        player.setVelocity(0, 0);
        player.entityState |= EntityStateFlags.needsCreate | EntityStateFlags.needsDelete;
    },
    game_claim: (client: Client, entityArg: string) => {
        const TEntity = new Map([
          ["ArenaCloser", ArenaCloser],
          ["Dominator", Dominator],
          ["Shape", AbstractShape],
          ["Boss", AbstractBoss],
          ["AutoTurret", AutoTurret]
        ] as [string, typeof ObjectEntity][]).get(entityArg)

        if (!TEntity || !client.camera?.game.entities.AIs.length) return;

        const AIs = Array.from(client.camera.game.entities.AIs);
        for (let i = 0; i < AIs.length; ++i) {
            if (!(AIs[i].owner instanceof TEntity)) continue;
            client.possess(AIs[i]);
            return;
        }
    },
    admin_godmode: (client: Client, activeArg?: string) => {
        const player = client.camera?.cameraData.player;
        if (!Entity.exists(player) || !(player instanceof TankBody)) return;

        switch (activeArg) {
            case "on":
                player.setInvulnerability(true);
                break;
            case "off":
                player.setInvulnerability(false);
                break;
            default:
                player.setInvulnerability(!player.isInvulnerable);
                break;
        }
    },
    admin_summon: (client: Client, entityArg: string, countArg?: string, xArg?: string, yArg?: string) => {
        const count = countArg ? parseInt(countArg) : 1;
        const x = parseInt(xArg || "");
        const y = parseInt(yArg || "");
        const game = client.camera?.game;
        const TEntity = new Map([
            ["Defender", Defender],
            ["Summoner", Summoner],
            ["Guardian", Guardian],
            ["FallenOverlord", FallenOverlord],
            ["FallenBooster", FallenBooster],
            ["FallenAC", FallenAC],
            ["FallenSpike", FallenSpike],
            ["ArenaCloser", ArenaCloser],
            ["Crasher", Crasher],
            ["Pentagon", Pentagon],
            ["Square", Square],
            ["Triangle", Triangle]
        ] as [string, typeof ObjectEntity][]).get(entityArg);

        if (isNaN(count) || count < 0 || !game || !TEntity) return;

        for (let i = 0; i < count; ++i) {
            const boss = new TEntity(game);
            if (!isNaN(x) && !isNaN(y)) {
                boss.positionData.x = x;
                boss.positionData.y = y;
            }
        }
    },
    admin_kill_all: (client: Client) => {
        const game = client.camera?.game;
        if(!game) return;
        for (let id = 0; id <= game.entities.lastId; ++id) {
			const entity = game.entities.inner[id];
			if (Entity.exists(entity) && entity instanceof LivingEntity && entity !== client.camera?.cameraData.player) entity.healthData.health = 0;
		}
    },
    admin_close_arena: (client: Client) => {
        client?.camera?.game.arena.close();
    },
    admin_kill_entity: (client: Client, entityArg: string) => {
        const TEntity = new Map([
          ["ArenaCloser", ArenaCloser],
          ["Dominator", Dominator],
          ["Bullet", Bullet],
          ["Tank", TankBody],
          ["Shape", AbstractShape],
          ["Boss", AbstractBoss]
        ] as [string, typeof LivingEntity][]).get(entityArg);
        const game = client.camera?.game;
        if (!TEntity || !game) return;

        for (let id = 0; id <= game.entities.lastId; ++id) {
			const entity = game.entities.inner[id];
			if (Entity.exists(entity) && entity instanceof TEntity) entity.healthData.health = 0;
		}
    }
} as Record<CommandID, CommandCallback>

export const executeCommand = (client: Client, cmd: string, args: string[]) => {
    if (!commandDefinitions.hasOwnProperty(cmd) || !commandCallbacks.hasOwnProperty(cmd)) {
        return saveToVLog(`${client.toString()} tried to run the invalid command ${cmd}`);
    }

    if (client.accessLevel < commandDefinitions[cmd as CommandID].permissionLevel) {
        return saveToVLog(`${client.toString()} tried to run the command ${cmd} with a permission that was too low`);
    }

    commandCallbacks[cmd as CommandID](client, ...args);
}
