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
import { Colors, ArenaFlags, TeamFlags } from "../Const/Enums";
import Mothership from "../Entity/Misc/Mothership";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity, { ArenaState } from "../Native/Arena";
import { Entity } from "../Native/Entity";
import { PI2 } from "../util";

const arenaSize = 11150;
const TEAM_COLORS = [Colors.TeamBlue, Colors.TeamRed];

/**
 * Mothership Gamemode Arena
 */
export default class MothershipArena extends ArenaEntity {
    /** All team entities in game */
    public teams: TeamEntity[] = [];
    /** Motherships in game */
    public motherships: Mothership[] = [];

    /** Maps clients to their mothership */
    public playerTeamMotMap: Map<Client, Mothership> = new Map();

    public constructor(game: GameServer) {
        super(game);
        this.shapeScoreRewardMultiplier = 3.0;

        this.arena.values.GUI |= ArenaFlags.hiddenScores;

        // little fun thing to support multiple teams - spread colors around map
        let randAngle = Math.random() * PI2;
        for (const teamColor of TEAM_COLORS) {
            const team = new TeamEntity(this.game, teamColor);
            this.teams.push(team);
            const mot = new Mothership(this.game);
            this.motherships.push(mot);
    
            mot.relations.values.team = team;
            mot.style.values.color = team.team.values.teamColor;
            mot.position.values.x = Math.cos(randAngle) * arenaSize * 0.75;
            mot.position.values.y = Math.sin(randAngle) * arenaSize * 0.75;

            randAngle += PI2 / TEAM_COLORS.length;
        }

        this.updateBounds(arenaSize * 2, arenaSize * 2);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        if (!this.motherships.length && !this.playerTeamMotMap.has(client)) {
            const team = this.teams[~~(Math.random()*this.teams.length)];
            const { x, y } = this.findSpawnLocation();

            tank.position.values.x = x;
            tank.position.values.y = y;
            tank.relations.values.team = team;
            tank.style.values.color = team.team.teamColor;
            return;
        }

        const mothership = this.playerTeamMotMap.get(client) || this.motherships[~~(Math.random() * this.motherships.length)];
        this.playerTeamMotMap.set(client, mothership);

        tank.relations.values.team = mothership.relations.values.team;
        tank.style.values.color = mothership.style.values.color;

        // TODO: Possess mothership if its unpossessed
        if (Entity.exists(mothership)) {
            tank.position.values.x = mothership.position.values.x;
            tank.position.values.y = mothership.position.values.y;
        } else {
            const { x, y } = this.findSpawnLocation();

            tank.position.values.x = x;
            tank.position.values.y = y;
        }

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
    public updateScoreboard(scoreboardPlayers: TankBody[]) {
        this.motherships.sort((m1, m2) => m2.health.values.health - m1.health.values.health);
        const length = Math.min(10, this.motherships.length);
        for (let i = 0; i < length; ++i) {
            const mothership = this.motherships[i];
            const team = mothership.relations.values.team;
            const isTeamATeam = team instanceof TeamEntity;
            if (isTeamATeam) {
                team.team.mothershipX = mothership.position.values.x;
                team.team.mothershipY = mothership.position.values.y;
                team.team.mothership |= TeamFlags.hasMothership;
            }
            /** @ts-ignore */
            if (mothership.style.values.color === Colors.Tank) this.arena.values.scoreboardColors[i] = Colors.ScoreboardBar;
            /** @ts-ignore */
            else this.arena.values.scoreboardColors[i] = mothership.style.values.color;
            /** @ts-ignore */
            this.arena.values.scoreboardNames[i] = isTeamATeam ? team.teamName : `Mothership ${i+1}`;
            // TODO: Change
            /** @ts-ignore */
            this.arena.values.scoreboardTanks[i] = -1;
            /** @ts-ignore */
            this.arena.values.scoreboardScores[i] = mothership.health.values.health;
            /** @ts-ignore */
            this.arena.values.scoreboardSuffixes[i] = " HP";
        }
       
        this.arena.scoreboardAmount = length;
    }
    public tick(tick: number) {
        // backwards to preserve
        for (let i = this.motherships.length; i --> 0;) {
            const mot = this.motherships[i];
            if (!Entity.exists(mot)) {
                const pop = this.motherships.pop();
                if (pop && i < this.motherships.length) this.motherships[i] = pop;
            }
        }

        if (this.motherships.length <= 1) {
            if (this.state === ArenaState.OPEN) {
                this.state = ArenaState.OVER;
                setTimeout(() => {
                    this.close();
                }, 5000);
            }
        }

        super.tick(tick);
    }
}
