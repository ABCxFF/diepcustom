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

import { Colors, MotionFlags, NametagFlags } from "../../Const/Enums";
import { NameGroup } from "../../Native/FieldGroups";
import { AI } from "../AI";
import { normalizeAngle, PI2 } from "../../util";

/**
 * Ticks between turns
 */
const TURN_TIMEOUT = 300;
/**
 * Abstract class which all shapes are subclasses of.
 * 
 * Used to calculate tick speed from `BASE_ROTATION`, `BASE_ORBIT`, and `BASE_VELOCITY`,
 * all of which are defined staticly, and can be defined a subclass statically as well.
 */
export default class AbstractShape extends LivingEntity {
    /** Used to calculate the speed at which the shape turns. Radians Per Tick. */
    protected static BASE_ROTATION = AI.PASSIVE_ROTATION;
    /** Used to calculate the speed at which the shape orbits. Radians Per Tick. */
    protected static BASE_ORBIT = 0.005;
    /** The velocity of the shape's orbits. */
    protected static BASE_VELOCITY = 1;

    /** Always existant name field group, present in all shapes. */
    public name: NameGroup = new NameGroup(this);
    /** If the shape is shiny or not */
    public isShiny: boolean = false;

    /** The current direction of the shape's orbit. */
    protected orbitAngle: number;
    /** The decided orbit rate, based on the constructor's BASE_ORBIT. *//* @ts-ignore */
    protected orbitRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ORBIT
    /** The decided rotation rate, based on the constructor's BASE_ROTATION. *//* @ts-ignore */
    protected rotationRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ROTATION
    /** The decided velocity of the shape, based on the constructor's BASE_VELOCITY. *//* @ts-ignore */
    protected shapeVelocity = this.constructor.BASE_VELOCITY;

    /** Whether or not the tank is turning */
    protected isTurning: number = 0;
    /** The destination for the angle of the shape's orbit - it slowly becomes this */
    protected targetTurningAngle: number = 0;

    public constructor(game: GameServer) {
        super(game);

        this.relations.values.team = game.arena;

        // shape names are by default hidden
        this.name.values.nametag = NametagFlags.hidden;
        this.position.values.motion |= MotionFlags.absoluteRotation;
        this.orbitAngle = this.position.values.angle = (Math.random() * PI2);
    }

    protected turnTo(angle: number) {
        if (normalizeAngle(this.orbitAngle - angle) < 0.20) return;
        this.targetTurningAngle = angle;
        this.isTurning = TURN_TIMEOUT;
    }

    public tick(tick: number) {
        // goes down too much
        if (this.isTurning === 0) {
            if (this.position.values.x > this.game.arena.arena.values.rightX - 400
                || this.position.values.x < this.game.arena.arena.values.leftX + 400
                || this.position.values.y < this.game.arena.arena.values.topY + 400
                || this.position.values.y > this.game.arena.arena.values.bottomY - 400) {
                this.turnTo(Math.PI + Math.atan2(this.position.values.y, this.position.values.x));
            } else if (this.position.values.x > this.game.arena.arena.values.rightX - 500) {
                this.turnTo(Math.sign(this.orbitRate) * Math.PI / 2);
            } else if (this.position.values.x < this.game.arena.arena.values.leftX + 500) {
                this.turnTo(-1 * Math.sign(this.orbitRate) * Math.PI / 2);
            } else if (this.position.values.y < this.game.arena.arena.values.topY + 500) {
                this.turnTo(this.orbitRate > 0 ? 0 : Math.PI);
            } else if (this.position.values.y > this.game.arena.arena.values.bottomY - 500) {
                this.turnTo(this.orbitRate > 0 ? Math.PI : 0);
            }
        }
        this.position.angle += this.rotationRate;
        this.orbitAngle += this.orbitRate + (this.isTurning === TURN_TIMEOUT ? this.orbitRate * 10 : 0);
        if (this.isTurning === TURN_TIMEOUT && (((this.orbitAngle - this.targetTurningAngle) % (PI2)) + (PI2)) % (PI2) < 0.20) {
            this.isTurning -= 1;
        } else if (this.isTurning !== TURN_TIMEOUT && this.isTurning !== 0) this.isTurning -= 1;

        // convert from angle to orbit angle: angle / (10 / 3)
        // convert from orbit angle to angle: orbitAngle * (10 / 3)
        this.maintainVelocity(this.orbitAngle, this.shapeVelocity);

        super.tick(tick);
    }
}
