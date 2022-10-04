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
import Drone from "./Drone";

import { Colors, ObjectFlags, Tank } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { AI } from "../../AI";
import { BarrelBase } from "../TankBody";
import AbstractShape from "../../Shape/AbstractShape";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class NecromancerSquare extends Drone {
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, shape: AbstractShape) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;
        
        this.ai = new AI(this);
        this.ai.viewRange = 900;

        this.physics.values.sides = shape.physics.values.sides;
        this.physics.values.size = shape.physics.values.size;
        /** @ts-ignore */
        this.damagePerTick *= shape.damagePerTick / 8;
        /** @ts-ignore */
        this.health.values.maxHealth = this.health.values.health *= (shape.damagePerTick / 8);
        // if (shape.isShiny) this.health.values.maxHealth = this.health.values.health *= 10
        this.style.values.color = tank.relations.values.team?.team?.values.teamColor || Colors.NecromancerSquare;
        if (this.physics.values.objectFlags & ObjectFlags.noOwnTeamCollision) this.physics.values.objectFlags ^= ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= ObjectFlags.onlySameOwnerCollision;

        // TODO(ABC):
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        if (tankDefinition && tankDefinition.id === Tank.Battleship) {
            this.lifeLength = 88;
        } else {
            this.lifeLength = Infinity;
            if (this.physics.values.objectFlags & ObjectFlags.canEscapeArena) this.physics.values.objectFlags ^= ObjectFlags.canEscapeArena;
        }
        this.deathAccelFactor = 1;

        this.physics.values.pushFactor = 4;
        this.physics.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed = 0;
    }
}
