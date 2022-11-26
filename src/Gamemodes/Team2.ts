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
 const baseWidth = 2007;
// const arenaSize = 2000;
// const baseWidth = 407;

/**
 * Teams2 Gamemode Arena
 */
export default class Teams2Arena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeamBase: TeamBase;
    /** Red Team entity */
    public redTeamBase: TeamBase;
    // /** Limits shape count 100 */
    //     protected shapes: ShapeManager = new class extends ShapeManager {
    //     protected get wantedShapes() {
    //         return 64;
    //     }
    // }(this);

    /** Maps clients to their teams */
    public playerTeamMap: Map<Client, TeamBase> = new Map();
    
    public constructor(game: GameServer) {
        super(game);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamBlue), -arenaSize + baseWidth / 2, 0, arenaSize * 2, baseWidth);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamRed), arenaSize - baseWidth / 2, 0, arenaSize * 2, baseWidth);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseWidth;
        
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relations.values.team = base.relations.values.team;
        tank.style.values.color = base.style.values.color;
        tank.position.values.x = base.position.values.x + xOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
}
