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
import Barrel from "../Tank/Barrel";
//import TankDefinitions from "../../Const/TankDefinitions";
import AbstractBoss from "./AbstractBoss";

import { Colors, Tank } from "../../Const/Enums";
import { AIState } from "../AI";

/**
 * Class which represents the boss "Summoner"
 */
export default class Summoner extends AbstractBoss {
    public constructor(game: GameServer) {
        super(game);

        this.name.values.name = 'Summoner';
        this.style.values.color = Colors.EnemySquare;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = 150 * Math.SQRT1_2;
        this.physics.values.sides = 4;

        this.barrels.push(new Barrel(this, {
            angle: 0,
            offset: 0,
            // Scale cuz direct
            size: 135 / (1.01 ** (75 - 1)),
            width: 75 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 1,
            recoil: 2,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 7,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 12.5,
                damage: 0.75,
                speed: 1.7,
                scatterRate: 1,
                lifeLength: -1,
                absorbtionFactor: 1,
                color: 16,
                sides: 4
            }
        }));
        this.barrels.push(new Barrel(this, {
            angle: Math.PI / 2,
            offset: 0,
            // Scale cuz direct
            size: 135 / (1.01 ** (75 - 1)),
            width: 75 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 0.25,
            recoil: 2,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 7,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 12.5,
                damage: 0.75,
                speed: 1.7,
                scatterRate: 1,
                lifeLength: -1,
                absorbtionFactor: 1,
                color: 16,
                sides: 4
            }
        }));
        this.barrels.push(new Barrel(this, {
            angle: Math.PI / -2,
            offset: 0,
            // Scale cuz direct
            size: 135 / (1.01 ** (75 - 1)),
            width: 75 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 0.25,
            recoil: 2,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 7,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 12.5,
                damage: 0.75,
                speed: 1.7,
                scatterRate: 1,
                lifeLength: -1,
                absorbtionFactor: 1,
                color: 16,
                sides: 4
            }
        }));
        this.barrels.push(new Barrel(this, {
            angle: -Math.PI,
            offset: 0,
            // Scale cuz direct
            size: 135 / (1.01 ** (75 - 1)),
            width: 75 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 0.25,
            recoil: 2,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 7,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 12.5,
                damage: 0.75,
                speed: 1.7,
                scatterRate: 1,
                lifeLength: -1,
                absorbtionFactor: 1,
                color: 16,
                sides: 4
            }
        }));
    }

    public tick(tick: number) {
        super.tick(tick);

        if (this.ai.state !== AIState.possessed) {
            this.inputs.flags = 0;
            this.position.angle += this.ai.passiveRotation;
        }
    }
}