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

import * as util from "../../util";

import Square from "../Shape/Square";
import NecromancerSquare from "./Projectile/NecromancerSquare";
import GameServer from "../../Game";
import Camera, { CameraEntity } from "../../Native/Camera";
import LivingEntity from "../Live";
import ObjectEntity from "../Object";
import Barrel from "./Barrel";

import { Colors, StyleFlags, StatCount, Tank, CameraFlags, Stat, InputFlags, ObjectFlags, MotionFlags } from "../../Const/Enums";
import { Entity } from "../../Native/Entity";
import { NameGroup, ScoreGroup } from "../../Native/FieldGroups";
import { Addon, AddonById } from "./Addons";
import { getTankById, TankDefinition } from "../../Const/TankDefinitions";
import { DevTank } from "../../Const/DevTankDefinitions";
import { Inputs } from "../AI";
import AbstractBoss from "../Boss/AbstractBoss";

/**
 * Abstract type of entity which barrels can connect to.
 * - `sizeFactor` is required and must be a `number`
 * - `cameraEntity` is required and must be a `Camera`
 */
export type BarrelBase = ObjectEntity & { sizeFactor: number, cameraEntity: Entity, reloadTime: number, inputs: Inputs };

/**
 * The Tank Body, which could also be called the Player class, converts defined
 * tank data into diep entities. Controls speeds, barrels, addons, and names.
 * Created for each spawn.
 */
export default class TankBody extends LivingEntity implements BarrelBase {
    /** Always existant name field group, present on all tanks. */
    public name: NameGroup = new NameGroup(this);
    /** Always existant score field group, present on all tanks. */
    public score: ScoreGroup = new ScoreGroup(this);

    /** The camera entity which stores stats and level data about the tank. */
    public cameraEntity: CameraEntity;
    /** The inputs of the client, lets the barrels know when to shoot etc. */
    public inputs: Inputs;

    /** The tank's barrels, if any. */
    public barrels: Barrel[] = [];
    /** The tank's addons, if any. */
    private addons: Addon[] = [];

    /** Size of the tank at level 1. Defined by tank loader.  */
    public baseSize = 50;
    /** The definition of the currentTank */
    public definition: TankDefinition = getTankById(Tank.Basic) as TankDefinition;
    /** Reload time base, used for barrel's reloads. */
    public reloadTime = 15;
    /** The current tank definition / tank id. */
    private _currentTank: Tank | DevTank = Tank.Basic;
    /** Whether or not the spawn invulnerability happened already. */
    public spawnProtectionEnded = false;

    public constructor(game: GameServer, camera: CameraEntity, inputs: Inputs) {
        super(game);
        this.cameraEntity = camera;
        this.inputs = inputs;

        this.physics.values.size = 50;
        this.physics.values.sides = 1;
        this.style.values.color = Colors.Tank;

        this.relations.values.team = camera;
        this.relations.values.owner = camera;

        this.cameraEntity.camera.spawnTick = game.tick;
        this.cameraEntity.camera.camera |= CameraFlags.showDeathStats;

        // spawn protection
        this.style.values.styleFlags |= StyleFlags.invincibility;
        if (this.game.playersOnMap) this.physics.values.objectFlags |= ObjectFlags.minimap;

        this.damagePerTick = 20;
        this.setTank(Tank.Basic);
    }

    /** The active change in size from the base size to the current. Contributes to barrel and addon sizes. */
    public get sizeFactor() {
        return this.physics.values.size / this.baseSize;
    }

    /** The current tank type / tank id. */
    public get currentTank() {
        return this._currentTank;
    }

    /** This method allows for changing the current tank. */
    public setTank(id: Tank | DevTank) {
        // Delete old barrels and addons
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].isChild = false;
            this.children[i].delete();
        }
        this.children = [];
        this.barrels = [];
        this.addons = [];

        // Get the new tank data
        const tank = getTankById(id);
        const camera = this.cameraEntity;

        if (!tank) throw new TypeError("Invalid tank ID");
        this.definition = tank;
        if (!Entity.exists(camera)) throw new Error("No camera");

        this.physics.sides = tank.sides;
        this.style.opacity = 1;

        for (let i: Stat = 0; i < StatCount; ++i) {
            const {name, max} = tank.stats[i];

            camera.camera.statLimits[i] = max;
            camera.camera.statNames[i] = name;
            if (camera.camera.statLevels[i] > max) {
                camera.camera.statsAvailable += (camera.camera.statLevels[i] - (camera.camera.statLevels[i] = max));
            }
        }

        // Size ratios
        this.baseSize = tank.sides === 4 ? Math.SQRT2 * 32.5 : tank.sides === 16 ? Math.SQRT2 * 25 : 50;
        this.physics.absorbtionFactor = tank.absorbtionFactor;
        if (tank.absorbtionFactor === 0) this.position.motion |= MotionFlags.canMoveThroughWalls;
        else if (this.position.motion & MotionFlags.canMoveThroughWalls) this.position.motion ^= MotionFlags.canMoveThroughWalls

        camera.camera.tank = this._currentTank = id;
        if (tank.upgradeMessage && camera instanceof Camera) camera.client.notify(tank.upgradeMessage);

        // Build addons, then tanks, then addons.
        const preAddon = tank.preAddon;
        if (preAddon) {
            const AddonConstructor = AddonById[preAddon];
            if (AddonConstructor) this.addons.push(new AddonConstructor(this));
        }

        for (const barrel of tank.barrels) {
            this.barrels.push(new Barrel(this, barrel));
        }

        const postAddon = tank.postAddon;
        if (postAddon) {
            const AddonConstructor = AddonById[postAddon];
            if (AddonConstructor) this.addons.push(new AddonConstructor(this));
        }

        // Yeah, yeah why not
        this.cameraEntity.camera.tankOverride = tank.name;
        camera.setFieldFactor(tank.fieldFactor);
    }
    /** See LivingEntity.onKill */
    public onKill(entity: LivingEntity) {
        this.score.score = this.cameraEntity.camera.scorebar += entity.scoreReward;

        if (entity instanceof TankBody && entity.scoreReward && Math.max(this.cameraEntity.camera.values.level, 45) - entity.cameraEntity.camera.values.level <= 20 || entity instanceof AbstractBoss) {
            if (this.cameraEntity instanceof Camera) this.cameraEntity.client.notify("You've killed " + (entity.name.values.name || "an unnamed tank"));
        }

        // TODO(ABC):
        // This is actually not how necromancers claim squares.
        if (entity instanceof Square && this.definition.flags.canClaimSquares && this.barrels.length) {
            // If can claim, pick a random barrel that has drones it can still shoot, then shoot
            const MAX_DRONES_PER_BARREL = 11 + this.cameraEntity.camera.values.statLevels.values[Stat.Reload];
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && e.droneCount < MAX_DRONES_PER_BARREL);

            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];

                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.style.opacity = 1;
                }

                const sunchip = NecromancerSquare.fromShape(barrelToShoot, this, this.definition, entity);
            }
        }
    }

    /** See LivingEntity.onDeath */
   public onDeath(killer: LivingEntity) {
        if (!(this.cameraEntity instanceof Camera)) return this.cameraEntity.delete();
        if (!(this.cameraEntity.camera.player === this)) return;
        this.cameraEntity.spectatee = killer;
        this.cameraEntity.camera.FOV = 0.4;
        this.cameraEntity.camera.killedBy = (killer.name && killer.name.values.name) || "";
    }

    /** Destroys the tank body. Extends LivivingEntity.destroy(animate); */
    public destroy(animate=true) {
        // Stats etc
        if (!animate && Entity.exists(this.cameraEntity)) {
            if (this.cameraEntity.camera.player === this) {
                this.cameraEntity.camera.deathTick = this.game.tick;
                this.cameraEntity.camera.respawnLevel = Math.min(Math.max(this.cameraEntity.camera.values.level - 1, 1), Math.floor(Math.sqrt(this.cameraEntity.camera.values.level) * 3.2796));
            }

            // Wipe this nonsense
            this.barrels = [];
            this.addons = [];
        }
        super.destroy(animate);
    }

    public tick(tick: number) {
        this.position.angle = Math.atan2(this.inputs.mouse.y - this.position.values.y, this.inputs.mouse.x - this.position.values.x);

        if (!this.deletionAnimation && !this.inputs.deleted) this.physics.size = this.baseSize * this.cameraEntity.sizeFactor;
        else this.regenPerTick = 0;

        super.tick(tick);

        // If we're currently in a deletion animation
        if (this.deletionAnimation) return;

        if (this.inputs.deleted) {
            if (this.cameraEntity.camera.values.level <= 5) return this.destroy();
            this.lastDamageTick = tick;
            this.health.health -= 2 + this.health.values.maxHealth / 500;

            if (this.style.values.styleFlags & StyleFlags.invincibility) this.style.styleFlags ^= StyleFlags.invincibility;
            return;
            // return this.destroy();
        }

        if (this.definition.flags.zoomAbility && (this.inputs.flags & InputFlags.rightclick)) {
            if (!(this.cameraEntity.camera.values.camera & CameraFlags.useCameraCoords)) {
                const angle = Math.atan2(this.inputs.mouse.y - this.position.values.y, this.inputs.mouse.x - this.position.values.x)
                this.cameraEntity.camera.cameraX = Math.cos(angle) * 1000 + this.position.values.x;
                this.cameraEntity.camera.cameraY = Math.sin(angle) * 1000 + this.position.values.y;
                this.cameraEntity.camera.camera |= CameraFlags.useCameraCoords;
            }
        } else if (this.cameraEntity.camera.values.camera & CameraFlags.useCameraCoords) this.cameraEntity.camera.camera ^= CameraFlags.useCameraCoords;

        if (this.definition.flags.invisibility) {

            if (this.inputs.flags & InputFlags.leftclick) this.style.opacity += this.definition.visibilityRateShooting;
            if (this.inputs.flags & (InputFlags.up | InputFlags.down | InputFlags.left | InputFlags.right) || this.inputs.movement.x || this.inputs.movement.y) this.style.opacity += this.definition.visibilityRateMoving;
           
            this.style.opacity -= this.definition.invisibilityRate;

            this.style.opacity = util.constrain(this.style.values.opacity, 0, 1);
        }


        // Update stat related
        updateStats: {
            // Damage
            this.damagePerTick = this.cameraEntity.camera.statLevels[Stat.BodyDamage] * 6 + 20;
            if (this._currentTank === Tank.Spike) this.damagePerTick *= 1.5;

            // Max Health
            const maxHealthCache = this.health.values.maxHealth;

            this.health.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.camera.values.level - 1) + this.cameraEntity.camera.values.statLevels.values[Stat.MaxHealth] * 20;
            if (this.health.values.health === maxHealthCache) this.health.health = this.health.maxHealth; // just in case
            else if (this.health.values.maxHealth !== maxHealthCache) {
                this.health.health *= this.health.values.maxHealth / maxHealthCache
            }

            // Regen
            this.regenPerTick = (this.health.values.maxHealth * 4 * this.cameraEntity.camera.values.statLevels.values[Stat.HealthRegen] + this.health.values.maxHealth) / 25000;

            // Reload
            this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.camera.values.statLevels.values[Stat.Reload]);
        }

        this.score.score = this.cameraEntity.camera.values.scorebar;

        if (!this.spawnProtectionEnded && (this.style.values.styleFlags & StyleFlags.invincibility) && (this.game.tick >= this.cameraEntity.camera.values.spawnTick + 374 || this.inputs.attemptingShot() || this.inputs.movement.magnitude > 0)) {
            this.style.styleFlags ^= StyleFlags.invincibility;
            this.spawnProtectionEnded = true;
        }

        this.accel.add({
            x: this.inputs.movement.x * this.cameraEntity.camera.values.movementSpeed,
            y: this.inputs.movement.y * this.cameraEntity.camera.values.movementSpeed
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
    }
}
