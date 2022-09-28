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
import AbstractShape from "./AbstractShape";

import { Colors } from "../../Const/Enums";

/**
 * Pentagon entity class.
 */
export default class Pentagon extends AbstractShape {
    /** If the pentagon is an alpha pentagon or not */
    public isAlpha: boolean;

    protected static BASE_ROTATION = AbstractShape.BASE_ROTATION / 2;
    protected static BASE_ORBIT = AbstractShape.BASE_ORBIT / 2;
    protected static BASE_VELOCITY = AbstractShape.BASE_VELOCITY / 2;

    public constructor(game: GameServer, isAlpha=false, shiny=(Math.random() < 0.000001) && !isAlpha) {
        super(game);
        
        this.name.values.name = isAlpha ? "Alpha Pentagon" : "Pentagon";

        this.health.values.health = this.health.values.maxHealth = (isAlpha ? 3000 : 100);
        this.physics.values.size = (isAlpha ? 200 : 75) * Math.SQRT1_2;
        this.physics.values.sides = 5;
        this.style.values.color = shiny ? Colors.Shiny : Colors.EnemyPentagon;

        this.physics.values.absorbtionFactor = isAlpha ? 0.05 : 0.5;
        this.physics.values.pushFactor = 11;

        this.isAlpha = isAlpha;
        this.isShiny = shiny;

        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 3000 : 130;
        
        if (shiny) {
            this.scoreReward *= 100;
            this.health.values.health = this.health.values.maxHealth *= 10;
        }
    }
}