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

// TODO(speed): speed up spatial hashing somehow someway

export default class SpatialHashing implements CollisionManager {
    public cellSize: number;
    public hashMap = new Map<number, ObjectEntity[]>();
    public queryId = 0;

    constructor(cellSize: number) {
        this.cellSize = cellSize;
    }

    public insertEntity(entity: ObjectEntity) {
        const { sides, size, width } = entity.physicsData.values;
        const { x, y } = entity.positionData.values;
        const isLine = sides === 2;
        const radiW = isLine ? size / 2 : size;
        const radiH = isLine ? width / 2 : size;
        
        const topX = (x - radiW) >> this.cellSize;
        const topY = (y - radiH) >> this.cellSize;
        const bottomX = (x + radiW) >> this.cellSize;
        const bottomY = (y + radiH) >> this.cellSize;

        // Iterating over the y axis first is more cache friendly.
        for(let y = topY; y <= bottomY; ++y) {
            for(let x = topX; x <= bottomX; ++x) {
                const key: number = x | (y << 10);
                if(!this.hashMap.has(key)) {
                    this.hashMap.set(key, []);
                }
                /** @ts-ignore the key is guaranteed to be set */
                this.hashMap.get(key).push(entity);
            }
        }
    }

    public retrieve(x: number, y: number, width: number, height: number): ObjectEntity[] {
        const result: ObjectEntity[] = [];

        const startX = (x - width) >> this.cellSize;
        const startY = (y - height) >> this.cellSize;
        const endX = ((x + width) >> this.cellSize);
        const endY = ((y + height) >> this.cellSize);

        for (let y = startY; y <= endY; ++y) {
            for (let x = startX; x <= endX; ++x) {
                const key = x | (y << 10);
                const cell = this.hashMap.get(key);
                if (cell == null) continue;
                for (let i = 0; i < cell.length; ++i) {
                    if (cell[i]['_queryId'] != this.queryId) {
                        cell[i]['_queryId'] = this.queryId;
                        if (cell[i].hash !== 0) result.push(cell[i]);
                    }
                }
            }
        }

        // Force uint32 to prevent the queryId from going too high for javascript to handle.
        this.queryId = (this.queryId + 1) >>> 0;

        return result;
    }

    public retrieveEntitiesByEntity(entity: ObjectEntity): ObjectEntity[] {
        const { sides, size, width } = entity.physicsData.values;
        const { x, y } = entity.positionData;
        const isLine = sides === 2;
        const w = isLine ? size / 2 : size;
        const h = isLine ? width / 2 : size;
        return this.retrieve(x, y, w, h);
    }

    public reset() {
        this.hashMap = new Map();
    }
}
