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

import ObjectEntity from "../Entity/Object";
import CollisionManager from "./CollisionManager";

export default class SpatialHashing implements CollisionManager {
    public cellSize: number;
    public hashMap = new Map<number, ObjectEntity[]>();
    public queryId = 0;

    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    insertEntity(entity: ObjectEntity) {
        const physics = entity.physics;
        const position = entity.position;
        const radiW = (physics.sides === 2 ? physics.size / 2 : physics.size);
        const radiH = (physics.sides === 2 ? physics.width / 2 : physics.size);
        const startX = ((position.x - radiW) >> this.cellSize);
        const startY = ((position.y - radiH) >> this.cellSize);
        const endX = ((position.x + radiW) >> this.cellSize);
        const endY = ((position.y + radiH) >> this.cellSize);

        // Iterating over the y axis first is more cache friendly.
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const key = x | (y << 10);
                if (!this.hashMap.has(key)) this.hashMap.set(key, []);
                /** @ts-ignore the key is guaranteed to be set */
                this.hashMap.get(key).push(entity);
            }
        }
    }

    retrieve(x: number, y: number, width: number, height: number): ObjectEntity[] {
        const result: ObjectEntity[] = [];

        const startX = (x - width) >> this.cellSize;
        const startY = (y - height) >> this.cellSize;
        const endX = ((x + width) >> this.cellSize);
        const endY = ((y + height) >> this.cellSize);

        for (let y = startY; y <= endY; y++)
            for (let x = startX; x <= endX; x++) {
                const key = x | (y << 10);
                const cell = this.hashMap.get(key);
                if (cell == null) continue;
                for (let i = 0; i < cell.length; i++)
                    if (cell[i].physics.queryId != this.queryId) {
                        cell[i].physics.queryId = this.queryId;
                        if (cell[i].hash !== 0) result.push(cell[i]);
                    }
            }

        // Force uint32 to prevent the queryId from going too high for javascript to handle.
        this.queryId = (this.queryId + 1) >>> 0;

        return result;
    }

    retrieveEntitiesByEntity(entity: ObjectEntity): ObjectEntity[] {
        const physics = entity.physics;
        const position = entity.position;

        return this.retrieve(
            position.x,
            position.y,
            entity.physics.values.sides === 2 ? entity.physics.values.size / 2 : entity.physics.values.size,
            entity.physics.values.sides === 2 ? entity.physics.values.width / 2 : entity.physics.values.size);
    }

    reset() {
        this.hashMap = new Map();
    }
}
