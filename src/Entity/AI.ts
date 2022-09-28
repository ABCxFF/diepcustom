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

import GameServer from "../Game";
import Vector from "../Physics/Vector";
import LivingEntity from "./Live";
import ObjectEntity from "./Object";

import { InputFlags, ObjectFlags } from "../Const/Enums";
import { Entity } from "../Native/Entity";

// Beware
// The logic in this file is somewhat messed up

/**
 * Used for simplifying the current state of the AI.
 * - `idle`: When the AI is idle
 * - `target`: When the AI has found a target
 */
export enum AIState {
    idle = 0,
    hasTarget = 1,
    possessed = 3
}

/**
 * Inputs are the shared thing between AIs and Clients. Both use inputs
 * and both can replace eachother.
 */
export class Inputs {
    /**
     * InputFlags.
     */
    public flags = 0;
    /** Mouse position */
    public mouse: Vector = new Vector();
    /** Movement direction */
    public movement: Vector = new Vector();
    /** Whether the inputs are deleted or not. */
    public deleted = false;
    
    public constructor() {}

    public attemptingShot(): boolean {
        return !!(this.flags & InputFlags.leftclick);
    }
    public attemptingRepel(): boolean {
        return !!(this.flags & InputFlags.rightclick);
    }
}

/**
 * The Intelligence behind Auto Turrets.
 */
export class AI {
    /** Default static rotation that Auto Turrets rotate when in passive mode. */
    public static PASSIVE_ROTATION = 0.01;
    /** Whether or not the AI is available for taking... */
    public isTaken = false;
    
    /** Specific rotation of the AI in passive mode. */
    public passiveRotation = Math.random() < .5 ? AI.PASSIVE_ROTATION : -AI.PASSIVE_ROTATION;
    /** View range in diep units. */
    public viewRange = 1700;
    /** The state of the AI. */
    public state = AIState.idle;

    /** The inputs, which are more like outputs for the AI. */
    public inputs: Inputs = new Inputs();
    /** The entity's whose AI is `this`. */
    public owner: ObjectEntity;
    /** The current game. */
    public game: GameServer;
    /** The AI's target. */
    public target: ObjectEntity | null = null;
    /** The speed at which the ai's owner can move. */
    public movementSpeed = 1;
    /** The speed at which the ai can reach the target. */
    public aimSpeed = 1;

    public targetFilter: (possibleTarget: ObjectEntity) => boolean;

    public constructor(owner: ObjectEntity) {
        this.owner = owner;
        this.game = owner.game;

        this.inputs.mouse.set({
            x: 20,
            y: 0
        });

        this.targetFilter = () => true;

        this.game.entities.AIs.push(this);
    }

    /** Finds the closest entity in a different team */
    public findTarget() {
        const rootPos = this.owner.rootParent.position.values;
        const team = this.owner.relations.values.team;
        
        if (Entity.exists(this.target) 
                && team !== this.target.relations.values.team
                && this.targetFilter(this.target)
                // this range is inaccurate i think
                && (this.target.position.values.x - rootPos.x) ** 2 + (this.target.position.values.y - rootPos.y) ** 2 < (this.viewRange ** 2) * 2) return this.target;

        // const entities = this.game.entities.inner.slice(0, this.game.entities.lastId);
        const root = this.owner.rootParent === this.owner && this.owner.relations.values.owner instanceof ObjectEntity ? this.owner.relations.values.owner : this.owner.rootParent;
        const entities = this.viewRange === Infinity ? this.game.entities.inner.slice(0, this.game.entities.lastId) : this.game.entities.collisionManager.retrieve(root.position.values.x, root.position.values.y, this.viewRange, this.viewRange);

        let closestEntity = null;
        let closestDistSq =  this.viewRange ** 2;
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];

            if (!(entity instanceof LivingEntity) || // Do not target non living entities
                (entity.physics.values.objectFlags & ObjectFlags.base) || // Do not target bases.
                !(entity.relations.values.owner === null || !(entity.relations.values.owner instanceof ObjectEntity)) || // Do not target entities who have an object owner
                !this.targetFilter(entity)) continue; // Custom check
            
            if (entity.relations.values.team === team || entity.physics.values.sides === 0) continue;

            const distSq = (entity.position.values.x - rootPos.x) ** 2 + (entity.position.values.y - rootPos.y) ** 2;

            if (distSq < closestDistSq) {
                closestEntity = entity;
                closestDistSq = distSq;
                continue;
            }
        }

        return this.target = closestEntity;
    }

    /** Aims and predicts at the target. */
    public aimAt(target: ObjectEntity) {
        const movementSpeed = this.aimSpeed * 1.6;
        const ownerPos = this.owner.getWorldPosition();

        if (movementSpeed <= 0.001) { // Pls no weirdness
            const pos = {
                x: target.position.values.x,
                y: target.position.values.y
            }
            this.inputs.movement.set({
                x: pos.x - ownerPos.x,
                y: pos.y - ownerPos.y
            });
            this.inputs.mouse.set(pos);

            // this.inputs.movement.angle = Math.atan2(delta.y, delta.x);
            this.inputs.movement.magnitude = 1;
            return;
        }

        const delta = {
            x: target.position.values.x - ownerPos.x,
            y: target.position.values.y - ownerPos.y
        }

        let dist = Math.sqrt(delta.x ** 2 + delta.y ** 2);
        if (dist === 0) dist = 1;

        const unitDistancePerp = {
            x: delta.y / dist,
            y: -delta.x / dist
        }

        let entPerpComponent = unitDistancePerp.x * target.velocity.x + unitDistancePerp.y * target.velocity.y;

        if (entPerpComponent > movementSpeed * 0.9) entPerpComponent = movementSpeed * 0.9;
        else if (entPerpComponent < movementSpeed * -0.9) entPerpComponent = movementSpeed * -0.9;

        const directComponent = Math.sqrt(movementSpeed ** 2 - entPerpComponent ** 2);
        const offset = entPerpComponent / directComponent * dist;

        this.inputs.mouse.set({
            x: target.position.values.x + offset * unitDistancePerp.x,
            y: target.position.values.y + offset * unitDistancePerp.y
        });
        this.inputs.movement.magnitude = 1;
        this.inputs.movement.angle = Math.atan2(this.inputs.mouse.y - ownerPos.y, this.inputs.mouse.x - ownerPos.x);
    }

    public tick(tick: number) {
        // If its being posessed, but its possessor is deleted... then just restart;
        if (this.state === AIState.possessed) {
            if (!this.inputs.deleted) return;
            
            this.inputs = new Inputs();
            this.isTaken = false; // Only possessed when not taken
        }
        const target = this.findTarget();

        if (!target) {
            this.inputs.flags = 0;
            this.state = AIState.idle;
            const angle = this.inputs.mouse.angle + this.passiveRotation;
            
            this.inputs.mouse.set({
                x: Math.cos(angle) * 100,
                y: Math.sin(angle) * 100
            });
        } else {
            this.state = AIState.hasTarget;
            this.inputs.flags |= InputFlags.leftclick;
            this.aimAt(target);
        }
    }
}
