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
import Client from "../Client";
import Writer from "../Coder/Writer";
import TankBody from "../Entity/Tank/TankBody";
import ObjectEntity from "../Entity/Object";

import { Entity, EntityStateFlags, fieldGroupProps } from "./Entity";
import { CameraGroup, RelationsGroup } from "./FieldGroups";
import { CameraFlags, ClientBound, Colors, levelToScore, levelToScoreTable, ObjectFlags, Stat } from "../Const/Enums";
import { getTankById } from "../Const/TankDefinitions";
import { removeFast } from "../util";

import * as Fields from "../Const/Fields";

/**
 * Represents any entity with a camera field group.
 */
export class CameraEntity extends Entity {
    /** Always existant camera field group. Present in all GUI/camera entities. */
    public camera: CameraGroup = new CameraGroup(this);

    /** The current size of the tank the camera is in charge of. Calculated with level stuff */
    public sizeFactor: number = 1;

    /** Used to set the current camera's level. Should be the only way used to set level. */
    public setLevel(level: number) {
        const previousLevel = this.camera.values.level;
        this.camera.level = level;
        this.sizeFactor = Math.pow(1.01, level - 1);
        this.camera.levelbarMax = level < 45 ? 1 : 0; // quick hack, not correct values
        if (level <= 45) {
            this.camera.scorebar = levelToScore(level);

            const player = this.camera.values.player;
            if (Entity.exists(player) && player instanceof TankBody) {
                player.score.score = this.camera.values.scorebar;
                player.scoreReward = this.camera.values.scorebar;
            }
        }

        // Update stats available
        const statIncrease = Camera.calculateStatCount(level) - Camera.calculateStatCount(previousLevel);
        this.camera.statsAvailable += statIncrease;

        this.setFieldFactor(getTankById(this.camera.values.tank)?.fieldFactor || 1);
    }

    /** Sets the current FOV by field factor. */
    public setFieldFactor(fieldFactor: number) {
        this.camera.FOV = (.55 * fieldFactor) / Math.pow(1.01, (this.camera.values.level - 1) / 2);
    }

    public tick(tick: number) {
        if (Entity.exists(this.camera.values.player)) {
            const focus = this.camera.values.player;
            if (!(this.camera.values.camera & CameraFlags.useCameraCoords) && focus instanceof ObjectEntity) {
                this.camera.cameraX = focus.rootParent.position.values.x;
                this.camera.cameraY = focus.rootParent.position.values.y;
            }

            if (this.camera.values.player instanceof TankBody) {
                // Update player related data
                const player = this.camera.values.player as TankBody;

                const score = this.camera.values.scorebar;
                let newLevel = this.camera.values.level;
                while (newLevel < levelToScoreTable.length && score - levelToScore(newLevel + 1) >= 0) newLevel += 1

                if (newLevel !== this.camera.values.level) {
                    this.setLevel(newLevel);
                    this.camera.scorebar = score;
                }

                if (newLevel < levelToScoreTable.length) {
                    const levelScore = levelToScore(this.camera.values.level)
                    this.camera.levelbarMax = levelToScore(this.camera.values.level + 1) - levelScore;
                    this.camera.levelbarProgress = score - levelScore;
                }

                this.camera.movementSpeed = player.definition.speed * 2.55 * Math.pow(1.07, this.camera.values.statLevels.values[Stat.MovementSpeed]) / Math.pow(1.015, this.camera.values.level - 1)
            }
        } else {
            this.camera.camera |= CameraFlags.useCameraCoords;
        }
    }
}

/**
 * This is the entity that controls stats and other gui data.
 * It is also the class that compiles entity data and sends it to the client.
 */
export default class Camera extends CameraEntity {
    /** Client interface. */
    public client: Client;
    /** All entities in the view of the camera. Represented by id. */
    private view: Entity[] = [];

    /** Always existant relations field group. Present in all GUI/camera entities. */
    public relations: RelationsGroup = new RelationsGroup(this);
    /** Entity being spectated if any (deathscreen). */
    public spectatee: ObjectEntity | null = null;

    /** Calculates the amount of stats available at a specific level. */
    public static calculateStatCount(level: number) {
        if (level <= 0) return 0;
        if (level <= 28) return level - 1;

        return Math.floor(level / 3) + 18;
    }

    public constructor(game: GameServer, client: Client) {
        super(game);

        this.client = client;

        this.camera.values.respawnLevel = this.camera.values.level = this.camera.values.scorebar = 1;

        this.camera.values.FOV = .35;
        this.relations.values.team = this;
    }

    /** Adds an entity the camera's current view. */
    private addToView(entity: Entity) {
        let c = this.view.find(r => r.id === entity.id)
        if (c) {
            console.log(c.toString(), entity.toString(), c === entity)
        }
        this.view.push(entity);
    }

    /** Removes an entity the camera's current view. */
    private removeFromView(id: number) {
        const index = this.view.findIndex(r => r.id === id);
        if (index === -1) return;

        removeFast(this.view, index);
    }

    /** Updates the camera's current view. */
    private updateView(tick: number) {
        const w = this.client.write().u8(ClientBound.Update).vu(tick);

        const deletes: { id: number, hash: number, noDelete?: boolean }[] = [];
        const updates: Entity[] = [];
        const creations: Entity[] = [];

        // Yeah.
        if (this.view.length === 0) {
            creations.push(this.game.arena, this);
            this.view.push(this.game.arena, this);
        }

        const fov = this.camera.values.FOV;
        const width = (1920 / fov) / 1.5;
        const height = (1080 / fov) / 1.5;

        const entitiesNearRange = this.game.entities.collisionManager.retrieve(this.camera.values.cameraX, this.camera.values.cameraY, width, height);
        const entitiesInRange: ObjectEntity[] = [];

        const l = this.camera.values.cameraX - width;
        const r = this.camera.values.cameraX + width;
        const t = this.camera.values.cameraY - height;
        const b = this.camera.values.cameraY + height;
        for (let i = 0; i < entitiesNearRange.length; ++i) {
            const entity = entitiesNearRange[i];
            const width = entity.physics.values.sides === 2 ? entity.physics.values.size / 2 : entity.physics.values.size;
            const size = entity.physics.values.sides === 2 ? entity.physics.values.width / 2 : entity.physics.values.size;
                     
            if (entity.position.values.x - width < r &&
                entity.position.values.y + size > t &&
                entity.position.values.x + width > l &&
                entity.position.values.y - size < b) {
                    if (entity !== this.camera.values.player &&!(entity.style.values.opacity === 0 && !entity.deletionAnimation)) {
                        entitiesInRange.push(entity);
                    }
                }
        }

        for (let id = 0; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];
            
            if (entity instanceof ObjectEntity && !entitiesInRange.includes(entity) && (entity.physics.values.objectFlags & ObjectFlags.minimap)) entitiesInRange.push(entity);
        }

        if (Entity.exists(this.camera.values.player) && this.camera.values.player instanceof ObjectEntity) entitiesInRange.push(this.camera.values.player);

        for (let i = 0; i < this.view.length; ++i) {
            const entity = this.view[i]
            if (entity instanceof ObjectEntity) {
                // Orphan children must be destroyed
                if (!entitiesInRange.includes(entity.rootParent)) {
                    deletes.push({id: entity.id, hash: entity.preservedHash});
                    continue;
                }
            }
            // If the entity is gone, notify the client, if its updated, notify the client
            if (entity.hash === 0) {
                deletes.push({ id: entity.id, hash: entity.preservedHash });
            } else if (entity.state & EntityStateFlags.needsCreate) {
                if (entity.state & EntityStateFlags.needsDelete) deletes.push({hash: entity.hash, id: entity.id, noDelete: true});
                creations.push(entity);
            } else if (entity.state & EntityStateFlags.needsUpdate) {
                updates.push(entity);
            }
        }

        // Now compile
        w.vu(deletes.length);
        for (let i = 0; i < deletes.length; ++i) {
            w.entid(deletes[i]);
            if (!deletes[i].noDelete) this.removeFromView(deletes[i].id);
        }

        const entities = this.game.entities;
        for (const id of this.game.entities.otherEntities) {
            if (this.view.findIndex(r => r.id === id) === -1) {
                const entity = entities.inner[id];

                if (!entity) continue;
                if (entity instanceof CameraEntity) continue;

                creations.push(entity);

                this.addToView(entity);
            }
        }

        for (const entity of entitiesInRange) {
            if (this.view.indexOf(entity) === -1) {
                creations.push(entity);
                this.addToView(entity);

                if (entity instanceof ObjectEntity) {
                    if (entity.children.length && !entity.isChild) {
                        // add any of its children
                        this.view.push.apply(this.view, entity.children);
                        creations.push.apply(creations, entity.children);
                    }
                }
            } else {
                if (!Entity.exists(entity)) throw new Error("wtf");
                // add untracked children, if it has any
                if (entity.children.length && !entity.isChild) {
                    for (let child of entity.children) {
                        if (this.view.findIndex(r => r.id === child.id) === -1) {
                            this.view.push.apply(this.view, entity.children);
                            creations.push.apply(creations, entity.children);
                        } //else if (child.hash === 0) deletes.push({hash: child.preservedHash, id: child})
                    }
                }
            }
        }

        // Arrays of entities
        w.vu(creations.length + updates.length);
        for (let i = 0; i < updates.length; ++i) {
            this.compileUpdate(w, updates[i]);
        }
        for (let i = 0; i < creations.length; ++i) {
            this.compileCreation(w, creations[i]);
        }

        w.send();
    }

    /** Entity creation compiler function... Run! */
    private compileCreation(w: Writer, entity: Entity) {
        w.entid(entity).u8(1);

        // Field group def
        let at = -1;
        const groups = entity.fieldGroups;

        for (let i = 0; i < groups.length; ++i) {
            w.u8((groups[i] - at) ^ 1);

            at = groups[i];
        }
        w.u8(1);

        // Actual data
        const fields: Fields.FieldName[] = [];
        for (let i = 0; i < groups.length; ++i) {
            const group = entity[fieldGroupProps[groups[i]]];

            if (!group) throw new Error("Expected entity " + entity + " to have " + groups[i])
            fields.push(...group.fields);
        }

        Fields.order(fields);
        for (let i = 0; i < fields.length; ++i) {
            const fieldName = fields[i];

            const field = Fields.List[fieldName];
            const group = entity[fieldGroupProps[field.group]];

            /* @ts-ignore */
            const value = group.values[fieldName];

            // Do this right
            if (fieldName === "color" && value === Colors.Tank) {
                if (entity.relations && entity.relations.values.team === (this.camera.values.player && this.camera.values.player.relations && this.camera.values.player.relations.values.team)) w.u8(Colors.Tank)
                else w.u8(Colors.EnemyTank);
                continue;
            }

            if (!field.amount) {
                /* @ts-ignore */
                w[field.encType](value);
            } else {
                /* @ts-ignore */
                for (let i = 0; i < field.amount; ++i) w[field.encType](value.values[i]);
            }
        }
    }

    /** Entity update compiler function... Run! */
    private compileUpdate(w: Writer, entity: Entity) {
        w.entid(entity).raw(0, 1);

        const groups = entity.fieldGroups;

        const fields: Fields.FieldName[] = [];
        for (let i = 0; i < groups.length; ++i) {
            const group = entity[fieldGroupProps[groups[i]]];
            if (!group) throw new Error("Expected entity " + entity + " to have " + groups[i])
            fields.push(...group.findUpdate());
        }

        Fields.order(fields);

        let at = -1;
        for (let i = 0; i < fields.length; ++i) {
            const fieldName = fields[i];
            const field = Fields.List[fieldName];
            const group = entity[fieldGroupProps[field.group]];

            /* @ts-ignore */
            const value = group.values[fieldName];

            w.u8((field.index - at) ^ 1);
            at = field.index;
            
            // Do this right
            if (fieldName === "color" && value === Colors.Tank) {
                if (entity.relations && entity.relations.values.team === (this.camera.values.player && this.camera.values.player.relations && this.camera.values.player.relations.values.team)) w.u8(Colors.Tank)
                else w.u8(Colors.EnemyTank);
                continue
            }

            if (!field.amount) {
                /* @ts-ignore */
                w[field.encType](value);
            } else {
                const encType = fieldName === "scoreboardScores" ? "vi" : field.encType;
                const updates = value.findUpdate();

                let tAt = -1;

                for (let j = 0; j < updates.length; ++j) {
                    w.u8((updates[j] - tAt) ^ 1);

                    tAt = updates[j];
                    /* @ts-ignore */
                    w[encType](value.values[tAt])
                }

                w.u8(1);
            }
        }
        w.u8(1);
    }

    public tick(tick: number) {
        super.tick(tick);

        if (!Entity.exists(this.camera.values.player) || !(this.camera.values.player instanceof TankBody)) {
            if (Entity.exists(this.spectatee)) {
                const pos = this.spectatee.rootParent.position.values;
                this.camera.cameraX = pos.x;
                this.camera.cameraY = pos.y;
                this.camera.camera |= CameraFlags.useCameraCoords;
            }
        }

        // always last
        this.updateView(tick);
    }
}