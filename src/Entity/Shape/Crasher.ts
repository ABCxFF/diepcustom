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
import LivingEntity from "../Live";
import AbstractShape from "./AbstractShape";

import { Colors, MotionFlags } from "../../Const/Enums";
import { AI, AIState } from "../AI";

/**
 * Crasher entity class.
 */
export default class Crasher extends AbstractShape {
    /** Controls the artificial intelligence of the crasher */
    public ai: AI;

    /** Whether or not the crasher is large. */
    public isLarge: boolean;
    /** The max speed the crasher can move when targetting a player.s */
    private targettingSpeed: number;

    public constructor(game: GameServer, large=false) {
        super(game);

        this.name.values.name = "Crasher";

        this.position.values.motion |= MotionFlags.canMoveThroughWalls;
        this.health.values.health = this.health.values.maxHealth = large ? 30 : 10;
        this.physics.values.size = (large ? 55 : 35) * Math.SQRT1_2;
        this.physics.values.sides = 3;
        this.physics.values.absorbtionFactor = large ? 0.1 : 2;
        this.physics.values.pushFactor =  large ? 12 : 8;

        this.style.values.color = Colors.EnemyCrasher;

        this.scoreReward = large ? 25 : 15;
        this.damagePerTick = 8;
        this.isLarge = large;
        this.targettingSpeed = large ? 2.64 : 2.602;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
    }

    tick(tick: number) {
        this.ai.aimSpeed = 0;
        this.ai.movementSpeed = this.targettingSpeed;
        
        if (this.ai.state === AIState.idle) super.tick(tick);
        else {
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - this.position.values.y, this.ai.inputs.mouse.x - this.position.values.x);
            this.accel.add({
                x: this.ai.inputs.movement.x * this.targettingSpeed,
                y: this.ai.inputs.movement.y * this.targettingSpeed
            });
            
            // TODO(ABC):
            // Better way?
            LivingEntity.prototype.tick.call(this, tick);
        }

        this.ai.inputs.movement.set({
            x: 0,
            y: 0
        })
    }
}
