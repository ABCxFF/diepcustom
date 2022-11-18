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

import Client from "../Client";
import { ClientBound, Colors, ColorsHexCode, GUIFlags, MothershipFlags } from "../Const/Enums";
import Mothership from "../Entity/Misc/Mothership";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity, { ArenaState } from "../Native/Arena";
import { Entity } from "../Native/Entity";


// TODO
// Replace RED and BLUE with TeamNames[etc], so we can apply to Dom and tag easily, also would make sorting of motherships easier (dynamic)

const arenaSize = 11150;
/**
 * Mothership Gamemode Arena
 */
export default class MothershipArena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamBlue);
    /** Red Team entity */
    public redTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamRed);

    public mothershipBlue: Mothership = new Mothership(this);

    public mothershipRed: Mothership = new Mothership(this);

    public constructor(game: GameServer) {
        super(game);

        this.arena.GUI |= GUIFlags.hideScorebar;

        this.blueTeam.team.values.mothership |= MothershipFlags.showArrow;
        this.redTeam.team.values.mothership |= MothershipFlags.showArrow;

        this.updateBounds(arenaSize * 2, arenaSize * 2);

        const ms0 = this.mothershipBlue;
        const ms1 = this.mothershipRed;


        const { x, y } = this.findSpawnLocation();

        ms0.relations.values.team = this.blueTeam;
        ms0.style.values.color = this.blueTeam.team.values.teamColor;
        ms0.position.values.x = y;
        ms0.position.values.y = x;

        ms1.relations.values.team = this.redTeam;
        ms1.style.values.color = this.redTeam.team.values.teamColor;
        ms1.position.values.x = x;
        ms1.position.values.y = y;

    }
    public spawnPlayer(tank: TankBody, client: Client) {

        if (Math.random() < 0.5) {
            const { x, y } = this.mothershipBlue.position.values;
            tank.relations.values.team = this.blueTeam;
            tank.style.values.color = this.blueTeam.team.values.teamColor;
            tank.position.values.x = x;
            tank.position.values.y = y;
        } else {
            const { x, y } = this.mothershipRed.position.values;
            tank.relations.values.team = this.redTeam;
            tank.style.values.color = this.redTeam.team.values.teamColor;
            tank.position.values.x = x;
            tank.position.values.y = y;
        }



        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
    public updateScoreboard(scoreboardPlayers: TankBody[]) {

        const blueMothership = this.mothershipBlue;
        const redMothership = this.mothershipRed;


        const bhp = blueMothership.health.values.health;
        const rhp = redMothership.health.values.health;

        let idx = rhp > bhp ? 1 : 0;
        let idy = idx == 1 ? 0 : 1;

        let amount = 2;
        if (Entity.exists(redMothership)) {
            this.redTeam.team.mothershipX = redMothership.position.values.x;
            this.redTeam.team.mothershipY = redMothership.position.values.y;
            /** @ts-ignore */
            if (redMothership.style.values.color === Colors.Tank) this.arena.values.scoreboardColors[idy] = Colors.ScoreboardBar;
            /** @ts-ignore */
            else this.arena.values.scoreboardColors[idy] = redMothership.style.values.color;
            /** @ts-ignore */
            this.arena.values.scoreboardNames[idy] = "RED";
            /** @ts-ignore */
            this.arena.values.scoreboardScores[idy] = redMothership.health.values.health;
            /** @ts-ignore */
            this.arena.values.scoreboardTanks[idy] = -1;
            /** @ts-ignore */
            this.arena.values.scoreboardSuffixes[idy] = " HP";
        } else {
            amount--;
            this.redTeam.team.mothership &= ~MothershipFlags.showArrow;
        }
        if (Entity.exists(blueMothership)) {
            let bhp = blueMothership.health.values.health;
            this.blueTeam.team.mothershipX = blueMothership.position.values.x;
            this.blueTeam.team.mothershipY = blueMothership.position.values.y;
            idx = rhp > bhp ? 1 : 0;
            idy = idx == 1 ? 0 : 1;
            /** @ts-ignore */
            if (blueMothership.style.values.color === Colors.Tank) this.arena.values.scoreboardColors[idx] = Colors.ScoreboardBar;
            /** @ts-ignore */
            else this.arena.values.scoreboardColors[idx] = blueMothership.style.values.color;
            /** @ts-ignore */
            this.arena.values.scoreboardNames[idx] = "BLUE";
            /** @ts-ignore */
            this.arena.values.scoreboardScores[idx] = blueMothership.health.values.health;
            /** @ts-ignore */
            this.arena.values.scoreboardTanks[idx] = -1;
            /** @ts-ignore */
            this.arena.values.scoreboardSuffixes[idx] = " HP";
        } else {
            amount--;
            this.blueTeam.team.mothership &= ~MothershipFlags.showArrow;
        }

        this.arena.scoreboardAmount = amount;
    }
    public tick(tick: number) {
        super.tick(tick)
        if (this.arenaState === ArenaState.OPEN) {
            if (!Entity.exists(this.mothershipBlue)) {
                this.game.broadcast()
                    .u8(ClientBound.Notification)
                    .stringNT("RED has destroyed BLUE's Mothership!")
                    .u32(ColorsHexCode[Colors.TeamRed])
                    .float(-1)
                    .stringNT("").send();

                this.arenaState = ArenaState.OVER;
            }
            if (!Entity.exists(this.mothershipRed)) {
                this.game.broadcast()
                    .u8(ClientBound.Notification)
                    .stringNT("BLUE has destroyed RED's Mothership!")
                    .u32(ColorsHexCode[Colors.TeamBlue])
                    .float(-1)
                    .stringNT("").send();

                this.arenaState = ArenaState.OVER;
            }
            if (this.arenaState === ArenaState.OVER) {
                setTimeout(() => {
                    this.close();
                }, 10000);
            }
        }
    }
}
