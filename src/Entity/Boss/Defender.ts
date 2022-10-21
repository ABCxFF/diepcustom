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
import AbstractBoss from "./AbstractBoss";

import { Colors, Tank } from "../../Const/Enums";
import { AIState } from "../AI";

import { AddonById } from "../Tank/Addons";

/**
 * Class which represents the boss "Defender"
 */

export default class Defender extends AbstractBoss {
    public movementSpeed = 0.35;
    public turretScale = 0.5;

    public constructor(game: GameServer) {
        super(game);

        this.name.values.name = 'Defender';
        this.style.values.color = Colors.EnemyTriangle;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = 150 * Math.SQRT1_2;
        this.physics.values.sides = 3;

        if (AddonById.defender) new AddonById['defender'](this);

        this.barrels.push(new Barrel(this, {
            angle: Math.PI * 2 / 6 * 1,
            offset: 0,
            // Scale cuz direct
            size: 120 / (1.01 ** (75 - 1)),
            width: 71.4 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 4.5,
            recoil: 2,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: "trapLauncher",
            forceFire: true,
            bullet: {
                type: "trap",
                sizeRatio: 0.8,
                health: 12.5,
                damage: 8,
                speed: 2.5,
                scatterRate: 1,
                lifeLength: 3.2,
                absorbtionFactor: 1,
                color: 12
            }
        }));
        this.barrels.push(new Barrel(this, {
            angle: Math.PI,
            offset: 0,
            // Scale cuz direct
            size: 120 / (1.01 ** (75 - 1)),
            width: 71.4 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 4.5,
            recoil: 2,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: "trapLauncher",
            forceFire: true,
            bullet: {
                type: "trap",
                sizeRatio: 0.8,
                health: 12.5,
                damage: 8,
                speed: 2.5,
                scatterRate: 1,
                lifeLength: 3.2,
                absorbtionFactor: 1,
                color: 12,
                sides: 4
            }
        }));
        this.barrels.push(new Barrel(this, {
            angle: Math.PI * 2 / 6 * 5,
            offset: 0,
            // Scale cuz direct
            size: 120 / (1.01 ** (75 - 1)),
            width: 71.4 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 4.5,
            recoil: 2,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: "trapLauncher",
            forceFire: true,
            bullet: {
                type: "trap",
                sizeRatio: 0.8,
                health: 12.5,
                damage: 8,
                speed: 2.5,
                scatterRate: 1,
                lifeLength: 3.2,
                absorbtionFactor: 1,
                color: 12,
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
