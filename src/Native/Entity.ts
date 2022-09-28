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
import {RelationsGroup, BarrelGroup, PhysicsGroup, HealthGroup, UnusedGroup, ArenaGroup, NameGroup, CameraGroup, PositionGroup, StyleGroup, ScoreGroup, TeamGroup, fieldGroupProp} from "./FieldGroups";
/**
 * IDs for the groupings of fields in diep protocol.
 * For more details about these read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
export const fieldGroupProps: Record<FieldGroupID, fieldGroupProp> = ["relations", null, "barrel", "physics", "health", null, "unused", "arena", "name", "camera", "position", "style",  null, "score", "team"];

/**
 * IDs for the groupings of fields in diep protocol.
 * For more details read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
export enum FieldGroupID {
    relations   = 0,
    barrel      = 2,
    physics     = 3,
    health      = 4,
    unused      = 6,
    arena       = 7,
    name        = 8,
    camera      = 9,
    position    = 10,
    style       = 11,
    score       = 13,
    team        = 14
}

/**
 * The flags used for Entity.state property. Signals to the
 * manager and the camera what needs to be sent to the client.
 */
export enum EntityStateFlags {
    needsUpdate = 1 << 0,
    needsCreate = 1 << 1,
    needsDelete = 1 << 2
}

/**
 * The abstract Entity class which is used for all data in the game.
 * All entities can be compiled by a Camera class.
 */
export class Entity {
    /**
     * Determines if the first parameter is an entity and not a deleted one.
     */
    public static exists(entity: Entity | null | undefined): entity is Entity {
        return entity instanceof Entity && entity.hash !== 0
    }

    /**
     * - `0b01`: Has updated
     * - `0b10`: Needs creation (unused)
     */
    public state = 0;
    /**
     * List of all field groups (by id) that the entity has.
     */
    public fieldGroups: FieldGroupID[] = [];
    
    /**
     * Relations field group. Contains `owner`, `parent`, 
     * and `team` fields.
     */
    public relations: RelationsGroup | null = null;
    /**
     * Barrel field group. Contains `reloadTime` and other 
     * barrel related fields.
     */
    public barrel: BarrelGroup | null = null;
    /**
     * Physics field group. Contains `sides`, `size`, and other 
     * fields relating to physics.
     */
    public physics: PhysicsGroup | null = null;
    /**
     * Health field group. Contains `health`, `maxHealth`, and 
     * the `healthbar` fields.
     */
    public health: HealthGroup | null = null;
    /**
     * Unused field group. Supported by the client but has no affect. 
     * Never used by normal servers.
     */
    public unused: UnusedGroup | null = null;
    /**
     * Arena field group. Includes `scoreboardScores`,
     * `ticksUntilStart`, and other arena related fields.
     */
    public arena: ArenaGroup | null = null;
    /**
     * Name field group. Contains `name` and `nametag` fields.
     */
    public name: NameGroup | null = null;
    /**
     * Camera/GUI field group. Contains `statLevels`,
     * `tank`, `level`, and other GUI related fields.
     */
    public camera: CameraGroup | null = null;
    /**
     * Position field group. Contains `x`, `y`, `angle`,
     * and `motion` (flags) fields.
     */
    public position: PositionGroup | null = null;
    /**
     * Style field group. Contains `color`, `opacity`,
     * and other style related fields.
     */
    public style: StyleGroup | null = null;
    /**
     * Score field group. Contains `score` and `scorebar` fields.
     */
    public score: ScoreGroup | null = null;
    /**
     * Team field group. Contains `teamColor`, `mothershipX`,
     * and other team arrow related fields.
     */
    public team: TeamGroup | null = null;

    /** The current game server. */
    public game: GameServer;

    /** Entity id */
    public id: number = -1;
    /** Entity hash (will be 0 once the entity is deleted) */
    public hash: number = 0;
    /** Preserved entity hash (is never set to 0) */
    public preservedHash: number = 0;

    public constructor(game: GameServer) {
        // You're welcome in advance - makes it so field groups
        // dont mess up in order, if defined incorrectly.
        this.fieldGroups.push = function(...items: FieldGroupID[]) {
            if (items.length !== 1) throw new RangeError("Unexpected field group modification on " + this.toString())

            this[this.length] = items[0];
            this.sort((a, b) => a - b);

            return this.length;
        }

        this.game = game;

        game.entities.add(this);
    }

    /** Makes the  entity no longer in need of update. */
    public wipeState() {
        if (this.relations) this.relations.wipe();
        if (this.barrel) this.barrel.wipe();
        if (this.physics) this.physics.wipe();
        if (this.health) this.health.wipe();
        if (this.unused) this.unused.wipe();
        if (this.arena) this.arena.wipe();
        if (this.name) this.name.wipe();
        if (this.camera) this.camera.wipe();
        if (this.position) this.position.wipe();
        if (this.style) this.style.wipe();
        if (this.score) this.score.wipe();
        if (this.team) this.team.wipe();

        this.state = 0;
    }

    /** Deletes the entity from the entity manager system. */
    public delete() {
        this.wipeState();
        this.game.entities.delete(this.id);
    }

    /** Ticks the entity */
    public tick(tick: number) {}

    public toString() {
        return `${this.constructor.name} <${this.id}, ${this.preservedHash}>${this.hash === 0 ? "(deleted)" : ""} [${this.fieldGroups.join(", ")}]`
    }

    public [Symbol.toPrimitive](type: string) {
        if (type === "string") return this.toString()
        return this.preservedHash * 0x10000 + this.id;
    }
}