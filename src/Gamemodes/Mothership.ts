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
const TEAM_COLORS = [Colors.TeamBlue, Colors.TeamRed];

/**
 * Mothership Gamemode Arena
 */
export default class MothershipArena extends ArenaEntity {
    /** Team entity */
    public teams: TeamEntity[] = [];
    /** Motherships in game */
    public motherships: Mothership[] = [];

    public constructor(game: GameServer) {
        super(game);

        this.arena.GUI |= GUIFlags.hideScorebar;

        // little fun thing to support multiple teams - spread colors around map
        let randAngle = Math.random() * Math.PI * 2;
        for (const teamColor of TEAM_COLORS) {
            const team = new TeamEntity(this.game, teamColor);
            this.teams.push(team);

            const mot = new Mothership(this);
            this.motherships.push(mot);
    
            mot.relations.values.team = team;
            mot.style.values.color = team.team.values.teamColor;
            mot.position.values.x = Math.cos(randAngle) * arenaSize * 0.75;
            mot.position.values.y = Math.sin(randAngle) * arenaSize * 0.75;

            randAngle += Math.PI * 2 / TEAM_COLORS.length;
        }

        this.updateBounds(arenaSize * 2, arenaSize * 2);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        const team = this.teams[~~(Math.random() * this.teams.length)];

        tank.relations.values.team = team;
        tank.style.values.color = team.team.values.teamColor;

        if (team.team.values.mothership & MothershipFlags.hasMothership) {
            tank.position.values.x = team.team.values.mothershipX;
            tank.position.values.y = team.team.values.mothershipY;
        } else {
            const { x, y } = this.findSpawnLocation();

            tank.position.values.x = x;
            tank.position.values.y = y;
        }

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
    public updateScoreboard(scoreboardPlayers: TankBody[]) {
        this.motherships.sort((m1, m2) => m2.health.values.health - m1.health.values.health);

        for (let i = 0; i < this.motherships.length; ++i) {
            const mothership = this.motherships[i];
            const team = mothership.relations.values.team;
            const isTeamATeam = team instanceof TeamEntity;
            if (isTeamATeam) {
                team.team.mothershipX = mothership.position.values.x;
                team.team.mothershipY = mothership.position.values.y;
                team.team.mothership |= MothershipFlags.hasMothership;
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
       
        this.arena.scoreboardAmount = this.motherships.length;
    }
    public tick(tick: number) {
        // backwards to preserve
        for (let i = this.motherships.length; i --> 0;) {
            const mot = this.motherships[i];
            if (!Entity.exists(mot)) {
                const pop = this.motherships.pop();
                if (pop && i < this.motherships.length) this.motherships[i] = pop;

                if (this.arenaState === ArenaState.OPEN) {
                    this.arenaState = ArenaState.OVER;
                    setTimeout(() => {
                        this.close();
                    }, 10000);
                }
            }
        }

        super.tick(tick);
    }
}
