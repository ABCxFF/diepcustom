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
    /** Blue TeamBASEentity */
    public blueTeamBase: TeamBase;
    /** Red TeamBASE entity */
    public redTeamBase: TeamBase;
    /** Green TeamBASE entity */
    public greenTeamBase: TeamBase;
    /** Purple TeamBASE entity */
    public purpleTeamBase: TeamBase;

    /** Maps clients to their teams */
    public playerTeamMap: Map<Client, TeamBase> = new Map();

    public constructor(game: GameServer) {
        super(game);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamBlue), -arenaSize + baseSize / 2,  -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamRed), arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        this.greenTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamGreen), -arenaSize + baseSize / 2,  arenaSize - baseSize / 2, baseSize, baseSize);
        this.purpleTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamPurple), arenaSize - baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseSize,
              yOffset = (Math.random() - 0.5) * baseSize;
        
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase, this.greenTeamBase, this.purpleTeamBase][0|Math.random()*4];
        tank.relations.values.team = base.relations.values.team;
        tank.style.values.color = base.style.values.color;
        tank.position.values.x = base.position.values.x + xOffset;
        tank.position.values.y = base.position.values.y + yOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
}