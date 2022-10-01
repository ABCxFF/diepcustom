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
import ObjectEntity from "../Object";

import { ObjectFlags, Colors } from "../../Const/Enums";
/**
 * Only used for maze walls and nothing else.
 */
export default class MazeWall extends ObjectEntity {
    constructor(game: GameServer, x: number, y: number, width: number, height: number) {
        super(game);

        this.position.values.x = x;
        this.position.values.y = y;

        this.physics.values.width = width;
        this.physics.values.size = height;
        this.physics.values.sides = 2;
        this.physics.values.objectFlags |= ObjectFlags.wall | ObjectFlags.minimap;
        this.physics.values.pushFactor = 2;
        this.physics.values.absorbtionFactor = 0;

        this.style.values.borderThickness = 640;
        this.style.values.color = Colors.Box;
    }
}
