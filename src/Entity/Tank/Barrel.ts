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

import Bullet from "./Projectile/Bullet";
import Trap from "./Projectile/Trap";
import Drone from "./Projectile/Drone";
import Rocket from "./Projectile/Rocket";
import Skimmer from "./Projectile/Skimmer";
import Minion from "./Projectile/Minion";
import ObjectEntity from "../Object";
import { BarrelBase } from "./TankBody";

import { Colors, MotionFlags, ObjectFlags, ShootingFlags, Stat, Tank } from "../../Const/Enums";
import { BarrelGroup } from "../../Native/FieldGroups";
import { BarrelDefinition, TankDefinition } from "../../Const/TankDefinitions";
import { DevTank } from "../../Const/DevTankDefinitions";
import Flame from "./Projectile/Flame";
import MazeWall from "../Misc/MazeWall";
import { Entity } from "../../Native/Entity";
import CrocSkimmer from "./Projectile/CrocSkimmer";
/**
 * Class that determines when barrels can shoot, and when they can't.
 */
export class ShootCycle {
    /** The barrel this cycle is keeping track of. */
    private barrelEntity: Barrel;
    /** The current position in the cycle. */
    private pos = 0;
    /** The last known reload time of the barrel. */
    private reloadTime: number;

    public constructor(barrel: Barrel) {
        this.barrelEntity = barrel;
        this.barrelEntity.barrel.reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        this.reloadTime = this.pos = barrel.barrel.values.reloadTime;
    }

    public tick() {
        const reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        if (reloadTime !== this.reloadTime) {
            this.pos *= reloadTime / this.reloadTime;
            this.reloadTime = reloadTime;
        }

        /** @ts-ignore */
        const dontAlwaysShoot = this.barrelEntity.tank.definition?.id === Tank.Battleship || this.barrelEntity.tank.definition?.id === DevTank.Squirrel;
        /** @ts-ignore */
        const alwaysShoot = this.barrelEntity.tank.definition?.id === Tank.DominatorT;

        if (this.pos >= reloadTime) {
            // When its not shooting dont shoot, unless its a drone tank besides battleship or dom
            if (!(this.barrelEntity.attemptingShot || alwaysShoot) && ((this.barrelEntity.definition.bullet.type !== 'drone' && this.barrelEntity.definition.bullet.type !== 'minion') || dontAlwaysShoot)) {
                this.pos = reloadTime;
                return;
            }
            // When it runs out of drones, dont shoot
            if (typeof this.barrelEntity.definition.droneCount === 'number' && this.barrelEntity.droneCount >= this.barrelEntity.definition.droneCount) {
                this.pos = reloadTime;
                return;
            }
        }

        if (this.pos >= reloadTime * (1 + this.barrelEntity.definition.delay)) {
            this.barrelEntity.barrel.reloadTime = reloadTime;
            this.barrelEntity.shoot();
            this.pos %= reloadTime;
        } else {
            this.pos += 1;
        }
    }
}

/**
 * Addon like entity that is added onto trap launching barrels.
 * - Active when barrel.addon === "trapLauncher"
 */
export class TrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.physics.values.objectFlags = ObjectFlags.isTrapezoid | ObjectFlags.unknown1;
        this.style.values.color = Colors.Barrel;

        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width;
        this.physics.values.size = barrel.physics.values.width * (20 / 42);
        this.position.values.x = (barrel.physics.values.size + this.physics.values.size) / 2;
    }

    public resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width;
        this.physics.size = this.barrelEntity.physics.values.width * (20 / 42);
        this.position.x = (this.barrelEntity.physics.values.size + this.physics.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/**
 * The barrel class containing all barrel related data.
 * - Converts barrel definitions to diep objects
 * - Will contain shooting logic (or interact with it)
 */
export default class Barrel extends ObjectEntity {
    /** The raw data defining the barrel. */
    public definition: BarrelDefinition;
    /** The owner / tank / parent of the barrel.  */
    public tank: BarrelBase;
    /** The cycle at which the barrel can shoot. */
    public shootCycle: ShootCycle;
    /** Whether or not the barrel is cycling the shoot cycle. */
    public attemptingShot = false;
    /** Bullet base accel. Used for AI and bullet speed determination. */
    public bulletAccel = 20;
    /** Number of drones that this barrel shot that are still alive. */
    public droneCount = 0;

    /** Always existant barrel field group, present on all barrels. */
    public barrel: BarrelGroup = new BarrelGroup(this);

    public constructor(owner: BarrelBase, barrelDefinition: BarrelDefinition) {
        super(owner.game);

        this.tank = owner;
        this.definition = barrelDefinition;

        // Begin Loading Definition
        this.style.values.color = Colors.Barrel;
        this.physics.values.sides = 2;
        if (barrelDefinition.isTrapezoid) this.physics.values.objectFlags |= ObjectFlags.isTrapezoid;

        this.setParent(owner);
        this.relations.values.owner = owner;
        this.relations.values.team = owner.relations.values.team;

        const sizeFactor = this.tank.sizeFactor;
        const size = this.physics.values.size = this.definition.size * sizeFactor;

        this.physics.values.width = this.definition.width * sizeFactor;
        this.position.values.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.position.values.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.position.values.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;

        if (barrelDefinition.addon === "trapLauncher") new TrapLauncher(this);
        else if (barrelDefinition.addon === "domTrapLauncher") new TrapLauncher(this);

        this.barrel.values.trapezoidalDir = barrelDefinition.trapezoidDirection;
        this.shootCycle = new ShootCycle(this);

        this.bulletAccel = (20 + (owner.cameraEntity.camera?.values.statLevels.values[Stat.BulletSpeed] || 0) * 3) * barrelDefinition.bullet.speed;
    }

    /** Shoots a bullet from the barrel. */
    public shoot() {
        this.barrel.shooting ^= ShootingFlags.shoot;

        // No this is not correct
        const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
        let angle = this.definition.angle + scatterAngle + this.tank.position.values.angle;

        // Map angles unto
        // let e: Entity | null | undefined = this;
        // while (!((e?.position?.motion || 0) & MotionFlags.absoluteRotation) && (e = e.relations?.values.parent) instanceof ObjectEntity) angle += e.position.values.angle;

        this.rootParent.addAcceleration(angle + Math.PI, this.definition.recoil * 2);

        let tankDefinition: TankDefinition | null = null;
        /** @ts-ignore */
        if (typeof this.rootParent.definition === 'object') tankDefinition = this.rootParent.definition;


        switch (this.definition.bullet.type) {
            case "skimmer":
                new Skimmer(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Skimmer.BASE_ROTATION : Skimmer.BASE_ROTATION);
                break;
            case "rocket":
                new Rocket(this, this.tank, tankDefinition, angle);
                break;
            case 'bullet': {
                const bullet = new Bullet(this, this.tank, tankDefinition, angle);

                if (tankDefinition && (tankDefinition.id === Tank.ArenaCloser || tankDefinition.id === DevTank.Squirrel)) bullet.position.motion |= MotionFlags.canMoveThroughWalls;
                break;
            }
            case 'trap':
                new Trap(this, this.tank, tankDefinition, angle);
                break;
            case 'drone':
                new Drone(this, this.tank, tankDefinition, angle);
                break;
            case 'minion':
                new Minion(this, this.tank, tankDefinition, angle);
                break;
            case 'flame':
                new Flame(this, this.tank, tankDefinition, angle);
                break;
            case 'wall': {
                let w = new MazeWall(this.game, Math.round(this.tank.inputs.mouse.x / 50) * 50, Math.round(this.tank.inputs.mouse.y / 50) * 50, 250, 250);
                setTimeout(() => {
                    w.destroy();
                }, 60 * 1000);
                break;
            }
            case "croc": 
                new CrocSkimmer(this, this.tank, tankDefinition, angle);
                break;
            default:
                util.log('Ignoring attempt to spawn projectile of type ' + this.definition.bullet.type);
                break;
        }

    }


    /** Resizes the barrel; when the tank gets bigger, the barrel must as well. */
    protected resize() {
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physics.size = this.definition.size * sizeFactor;

        this.physics.width = this.definition.width * sizeFactor;
        this.position.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.position.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.position.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;

        // Updates bullet accel too
        this.bulletAccel = (20 + (this.tank.cameraEntity.camera?.values.statLevels.values[Stat.BulletSpeed] || 0) * 3) * this.definition.bullet.speed;
    }

    public tick(tick: number) {
        this.resize();
        if (!this.tank.rootParent.deletionAnimation){
            this.attemptingShot = this.tank.inputs.attemptingShot();
            this.shootCycle.tick();
        }

        this.relations.values.team = this.tank.relations.values.team;

        super.tick(tick);
    }
}