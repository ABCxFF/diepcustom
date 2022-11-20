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

import Barrel from "../Barrel";
import Bullet from "./Bullet";

import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";

export default class Flame extends Bullet {
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.baseSpeed *= 2;
        this.baseAccel = 0;
        this.damageReduction = 1;
        
        this.physics.values.sides = 4;
        this.physics.values.absorbtionFactor = this.physics.values.pushFactor = 0;
        this.lifeLength = 25 * barrel.definition.bullet.lifeLength;
    }

    public destroy(animate?: boolean): void {
        super.destroy(false);
    }

    public tick(tick: number) {
        super.tick(tick);

        this.damageReduction += 1 / 25;
        this.style.opacity -= 1 / 25;
    }
}