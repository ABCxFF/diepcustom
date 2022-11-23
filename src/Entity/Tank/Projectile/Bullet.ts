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

import LivingEntity from "../../Live";
import Barrel from "../Barrel";

import { HealthbarFlags, MotionFlags, ObjectFlags, Stat, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { EntityStateFlags } from "../../../Native/Entity";

/**
 * The bullet class represents the bullet entity in diep.
 */
export default class Bullet extends LivingEntity {
    /** The barrel that the bullet is being shot from. */
    protected barrelEntity: Barrel;
    /** The tick this entity was created in. */
    protected spawnTick = 0;
    /** Speed the bullet will accelerate at. */
    protected baseAccel = 0;
    /** Starting velocity of the bullet. */
    protected baseSpeed = 0;
    /** Percent of accel applied when dying. */
    protected deathAccelFactor = 0.5;
    /** Life length in ticks before the bullet dies. */
    protected lifeLength = 0;
    /** Angle the projectile is shot at. */
    protected movementAngle = 0;
    /** Definition of the tank (if existant) shooting the bullet. */
    protected tankDefinition: TankDefinition | null = null;
    /** Whether or not to use .shootAngle or .position.angle. */
    protected usePosAngle = false;
    /** The tank who shot the bullet. */
    protected tank: BarrelBase;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel.game);

        this.tank = tank;
        
        this.tankDefinition = tankDefinition;

        // if (barrel.definition.bullet.type === "drone") throw new TypeError("Invalid bullet type for this class");
        this.movementAngle = shootAngle;
        this.barrelEntity = barrel;
        this.spawnTick = barrel.game.tick;

        this.relations.values.owner = tank;

        tank.rootParent.style.zIndex = barrel.game.entities.zIndex++;

        const bulletDefinition = barrel.definition.bullet;
        const sizeFactor = tank.sizeFactor;
        const statLevels = tank.cameraEntity.camera?.values.statLevels.values;

        this.relations.values.team = barrel.relations.values.team;
        this.relations.values.owner = tank;

        this.physics.values.sides = bulletDefinition.sides ?? 1;
        this.physics.values.objectFlags |= ObjectFlags.noOwnTeamCollision | ObjectFlags.canEscapeArena;
        if (tank.position.values.motion & MotionFlags.canMoveThroughWalls) this.position.values.motion |= MotionFlags.canMoveThroughWalls
        this.physics.values.size = (barrel.physics.values.width / 2) * bulletDefinition.sizeRatio;
        this.style.values.color = bulletDefinition.color || tank.rootParent.style.values.color;
        this.style.values.styleFlags |= StyleFlags.noDmgIndicator;
        this.health.values.healthbar = HealthbarFlags.hidden;

        const bulletDamage = statLevels ? statLevels[Stat.BulletDamage] : 0;
        const bulletPenetration = statLevels ? statLevels[Stat.BulletPenetration] : 0;

        this.physics.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.physics.values.pushFactor = ((7 / 3) + bulletDamage) * bulletDefinition.damage * bulletDefinition.absorbtionFactor;

        this.baseAccel = barrel.bulletAccel;
        this.baseSpeed = barrel.bulletAccel + 30 - Math.random() * bulletDefinition.scatterRate;

        this.health.values.health = this.health.values.maxHealth = (1.5 * bulletPenetration + 2) * bulletDefinition.health;
        this.damagePerTick = (7 + bulletDamage * 3) * bulletDefinition.damage;
        this.damageReduction = 0.25;

        this.lifeLength = bulletDefinition.lifeLength * 72;

        const {x, y} = tank.getWorldPosition();
        
        this.position.values.x = x + (Math.cos(shootAngle) * barrel.physics.values.size) - Math.sin(shootAngle) * barrel.definition.offset * sizeFactor;
        this.position.values.y = y + (Math.sin(shootAngle) * barrel.physics.values.size) + Math.cos(shootAngle) * barrel.definition.offset * sizeFactor;
        this.position.values.angle = shootAngle;
    }

    /** Extends LivingEntity.onKill - passes kill to the owner. */
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.tank.onKill === 'function') this.tank.onKill(killedEntity);
    }

    public tick(tick: number) {
        super.tick(tick);

        if (tick === this.spawnTick + 1) this.addAcceleration(this.movementAngle, this.baseSpeed);
        else this.maintainVelocity(this.usePosAngle ? this.position.values.angle : this.movementAngle, this.baseAccel);

        if (tick - this.spawnTick >= this.lifeLength) this.destroy(true);
        // TODO(ABC):
        // This code will be reimplemented in the update that allows for easy camera entity switches
        if ((this.relations.values.team?.state || 0) & EntityStateFlags.needsDelete) this.relations.values.team = null
    }
}
