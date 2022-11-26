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
import { Colors, GUIFlags } from "../Const/Enums";
import Dominator from "../Entity/Misc/Dominator";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";


const arenaSize = 11150;
const baseSize = 3345;
const domBaseSize = baseSize / 2;
/**
 * Domination Gamemode Arena
 */
export default class DominationArena extends ArenaEntity {
    /** Blue TeamBASEentity */
    public blueTeamBase: TeamBase;
    /** Red TeamBASE entity */
    public redTeamBase: TeamBase;

    /** Maps clients to their teams */
    public playerTeamMap: Map<Client, TeamBase> = new Map();

    public constructor(game: GameServer) {
        super(game);
        this.shapeScoreRewardMultiplier = 2.0;

        this.updateBounds(arenaSize * 2, arenaSize * 2)

        this.arena.values.GUI |= GUIFlags.hideScorebar;

        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamBlue), -arenaSize + baseSize / 2,  -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Colors.TeamRed), arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        
        new Dominator(this, new TeamBase(game, this, arenaSize / 2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator(this, new TeamBase(game, this, arenaSize / -2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator(this, new TeamBase(game, this, arenaSize / -2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        new Dominator(this, new TeamBase(game, this, arenaSize / 2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseSize,
              yOffset = (Math.random() - 0.5) * baseSize;

        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relations.values.team = base.relations.values.team;
        tank.style.values.color = base.style.values.color;
        tank.position.values.x = base.position.values.x + xOffset;
        tank.position.values.y = base.position.values.y + yOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relations.team = tank.relations.values.team;
    }
}
