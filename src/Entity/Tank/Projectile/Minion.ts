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

import { InputFlags, ObjectFlags } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";

/**
 * Barrel definition for the factory minion's barrel.
 */
 const MinionBarrelDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.4,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};

/**
 * The drone class represents the minion (projectile) entity in diep.
 */
export default class Minion extends Drone implements BarrelBase {
    /** Size of the focus the minions orbit. */
    public static FOCUS_RADIUS = 850 ** 2;

    /** The minion's barrel */
    private minionBarrel: Barrel;

    /** The size ratio of the rocket. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;

        this.physics.values.sides = 1;
        this.physics.values.size *= 1.2;
        
        if (this.physics.values.objectFlags & ObjectFlags.noOwnTeamCollision) this.physics.values.objectFlags ^= ObjectFlags.noOwnTeamCollision;
        if (this.physics.values.objectFlags & ObjectFlags.canEscapeArena) this.physics.values.objectFlags ^= ObjectFlags.canEscapeArena;

        this.physics.values.objectFlags |= ObjectFlags.onlySameOwnerCollision;

        this.sizeFactor = this.physics.values.size / 50;
        this.cameraEntity = tank.cameraEntity;

        this.minionBarrel = new Barrel(this, MinionBarrelDefinition);
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        this.sizeFactor = this.physics.values.size / 50;
        this.reloadTime = this.tank.reloadTime;

        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;

        if (usingAI && this.ai.state === AIState.idle) {
            this.movementAngle = this.position.values.angle;
        } else {
            this.inputs.flags |= InputFlags.leftclick;

            const dist = inputs.mouse.distanceToSQ(this.position.values);

            if (dist < Minion.FOCUS_RADIUS / 4) { // Half
                this.movementAngle = this.position.values.angle + Math.PI;
            } else if (dist < Minion.FOCUS_RADIUS) {
                this.movementAngle = this.position.values.angle + Math.PI / 2;
            } else this.movementAngle = this.position.values.angle;
        }

        super.tickMixin(tick);
    }
}