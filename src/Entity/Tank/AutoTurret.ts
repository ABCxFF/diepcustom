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

import ObjectEntity from "../Object";
import Barrel from "./Barrel";

import { BarrelBase } from "./TankBody";
import { Colors, MotionFlags, NametagFlags, ObjectFlags, Stat, StyleFlags } from "../../Const/Enums";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { AI, AIState, Inputs } from "../AI";
import { Entity } from "../../Native/Entity";
import { NameGroup } from "../../Native/FieldGroups";
import LivingEntity from "../Live";

export const AutoTurretDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.3,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};

/**
 * Auto Turret Barrel + Barrel Base
 */
export default class AutoTurret extends ObjectEntity {
    // TODO(ABC):
    // Maybe just remove this
    /** For mounted turret name to show up on Auto Turrets. */
    public name: NameGroup = new NameGroup(this);

    /** Barrel's owner (Tank-like object). */
    private owner: BarrelBase;
    /** Actual turret / barrel. */
    public turret: Barrel;
    /** The AI controlling the turret. */
    public ai: AI;
    /** The AI's inputs, for determining whether to shoot or not. */
    public inputs: Inputs;
    /** Camera entity / team of the turret. */
    public cameraEntity: Entity;

    /** The reload time of the turret. */
    public reloadTime = 15;
    /** The size of the auto turret base */
    public baseSize: number;

    public constructor(owner: BarrelBase, turretDefinition: BarrelDefinition = AutoTurretDefinition, baseSize: number = 25) {
        super(owner.game);

        this.cameraEntity = owner.cameraEntity;
        this.ai = new AI(this);
        this.inputs = this.ai.inputs;

        this.owner = owner;
        
        this.setParent(owner);
        this.relations.values.owner = owner;

        this.relations.values.team = owner.relations.values.team;

        this.physics.values.sides = 1;
        this.baseSize = baseSize;
        this.physics.values.size = this.baseSize * this.sizeFactor;

        this.style.values.color = Colors.Barrel;
        this.style.values.styleFlags |= StyleFlags.aboveParent;

        this.position.values.motion |= MotionFlags.absoluteRotation;

        this.name.values.name = "Mounted Turret";
        this.name.values.nametag |= NametagFlags.hidden;

        this.turret = new Barrel(this, turretDefinition);
        this.turret.physics.values.objectFlags |= ObjectFlags.unknown1;
    }
    
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    public get sizeFactor() {
        return this.owner.sizeFactor;
    }

    /**
     * Called similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently (Maybe KillerEntity interface)
        /** @ts-ignore */
        if (typeof this.owner.onKill === 'function') this.owner.onKill(killedEntity);
    }

    public tick(tick: number) {
        if (this.inputs !== this.ai.inputs) this.inputs = this.ai.inputs;

        this.physics.size = this.baseSize * this.sizeFactor;

        this.ai.aimSpeed = this.turret.bulletAccel;
        // Top Speed
        this.ai.movementSpeed = 0;

        this.reloadTime = this.owner.reloadTime;

        if (this.ai.state === AIState.idle) {
            this.position.angle += this.ai.passiveRotation;
            this.turret.attemptingShot = false;
        } else {
            // Uh. Yeah
            const {x, y} = this.getWorldPosition();
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
}
