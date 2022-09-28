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

import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";
import Client from "../Client";

import TeamBase from "../Entity/Misc/TeamBase";
import TankBody from "../Entity/Tank/TankBody";

import { TeamEntity } from "../Entity/Misc/TeamEntity";
import { Colors } from "../Const/Enums";

const arenaSize = 11150;
const baseSize = 3345;

/**
 * Teams4 Gamemode Arena
 */
export default class Teams4Arena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamBlue);
    /** Red Team entity */
    public redTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamRed);
    /** Green Team entity */
    public greenTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamGreen);
    /** Purple Team entity */
    public purpleTeam: TeamEntity = new TeamEntity(this.game, Colors.TeamPurple);

    public constructor(game: GameServer) {
        super(game);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        new TeamBase(game, this.blueTeam, -arenaSize + baseSize / 2,  -arenaSize + baseSize / 2, baseSize, baseSize);
        new TeamBase(game, this.redTeam, arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        new TeamBase(game, this.greenTeam, -arenaSize + baseSize / 2,  arenaSize - baseSize / 2, baseSize, baseSize);
        new TeamBase(game, this.purpleTeam, arenaSize - baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;

        const x = Math.random() * baseSize,
              y = Math.random() * baseSize;
        
        const chance = Math.random();
        
        if (chance < 0.25) {
            tank.relations.values.team = this.blueTeam;
            tank.style.values.color = this.blueTeam.team.values.teamColor;
            tank.position.values.x = -arenaSize + x;
            tank.position.values.y = -arenaSize + y;
        } else if (chance < 0.5) {
            tank.relations.values.team = this.redTeam;
            tank.style.values.color = this.redTeam.team.values.teamColor;
            tank.position.values.x = arenaSize - x;
            tank.position.values.y = arenaSize - y;
        } else if (chance < 0.75) {
            tank.relations.values.team = this.greenTeam;
            tank.style.values.color = this.greenTeam.team.values.teamColor;
            tank.position.values.x = -arenaSize + x;
            tank.position.values.y = arenaSize - y;
        } else {
            tank.relations.values.team = this.purpleTeam;
            tank.style.values.color = this.purpleTeam.team.values.teamColor;
            tank.position.values.x = arenaSize - x;
            tank.position.values.y = -arenaSize + y;
        }

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
}