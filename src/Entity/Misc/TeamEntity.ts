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

import GameServer from "../../Game";

import { Colors } from "../../Const/Enums";
import { Entity } from "../../Native/Entity";
import { TeamGroup } from "../../Native/FieldGroups";

export type TeamGroupEntity = Entity & { team: TeamGroup }

export const ColorsTeamName: Record<Colors, string> = {
    [Colors.Border]: "BORDER",
    [Colors.Barrel]: "BARREL",
    [Colors.Tank]: "TANK",
    [Colors.TeamBlue]: "BLUE",
    [Colors.TeamRed]: "RED",
    [Colors.TeamPurple]: "PURPLE",
    [Colors.TeamGreen]: "GREEN",
    [Colors.Shiny]: "SHINY",
    [Colors.EnemySquare]: "SQUARE",
    [Colors.EnemyTriangle]: "TRIANGLE",
    [Colors.EnemyPentagon]: "PENTAGON",
    [Colors.EnemyCrasher]: "CRASHER",
    [Colors.Neutral]: "a mysterious group",
    [Colors.ScoreboardBar]: "SCOREBOARD",
    [Colors.Box]: "MAZE",
    [Colors.EnemyTank]: "ENEMY",
    [Colors.NecromancerSquare]: "SUNCHIP",
    [Colors.Fallen]: "FALLEN",
    [Colors.kMaxColors]: "UNKNOWN"
}

export class TeamEntity extends Entity implements TeamGroupEntity {
    /** This group makes `this` a team entity in the first place. */
    public team: TeamGroup = new TeamGroup(this);

    /** Used for notifications in team based gamemodes */
    public teamName: string;

    public constructor(game: GameServer, color: Colors, name: string = ColorsTeamName[color]) {
        super(game);

        this.team.values.teamColor = color;
        this.teamName = name;
    }
}
