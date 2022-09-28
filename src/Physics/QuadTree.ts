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

/**
 * UNDOCUMENTED FILE
 **/

import ObjectEntity from "../Entity/Object";
import CollisionManager from "./CollisionManager";

interface Range<T> {
    x: number;
    y: number;
    radiW: number;
    radiH: number;
    content: T;
}

class QuadTreeNode<T> {
    protected x = 0;
    protected y = 0;
    protected radiW = 0;
    protected radiH = 0;
    protected level = 0;

    protected objects: Range<T>[] = [];

    protected topLeft: QuadTreeNode<T> | null = null;
    protected topRight: QuadTreeNode<T> | null = null;
    protected bottomLeft: QuadTreeNode<T> | null = null;
    protected bottomRight: QuadTreeNode<T> | null = null;

    protected constructor(x: number, y: number, radiW: number, radiH: number, level: number) {
        this.x = x;
        this.y = y;
        this.radiW = radiW;
        this.radiH = radiH;
        this.level = level;
    }

    protected _insert(object: Range<T>) {
        // {entity, x, y, radiW, radiH}
        if (this.topLeft) {
            const top = object.y - object.radiH < this.y,
                bottom = object.y + object.radiH > this.y,
                left = object.x - object.radiW < this.x,
                right = object.x + object.radiW > this.x;

            if (top && left) this.topLeft._insert(object);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(object);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(object);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(object);

            return;
        }

        this.objects[this.objects.length] = object;

        if (this.objects.length === 5 && this.level <= 9) {
            const halfW = this.radiW / 2,
                halfH = this.radiH / 2,
                level = this.level + 1;
            this.topLeft = new QuadTreeNode(this.x - halfW, this.y - halfH, halfW, halfH, level);
            this.topRight = new QuadTreeNode(this.x + halfW, this.y - halfH, halfW, halfH, level);
            this.bottomLeft = new QuadTreeNode(this.x - halfW, this.y + halfH, halfW, halfH, level);
            this.bottomRight = new QuadTreeNode(this.x + halfW, this.y + halfH, halfW, halfH, level);

            var top, bottom, left, right;
            
            top = this.objects[0].y - this.objects[0].radiH < this.y;
            bottom = this.objects[0].y + this.objects[0].radiH > this.y;
            left = this.objects[0].x - this.objects[0].radiW < this.x;
            right = this.objects[0].x + this.objects[0].radiW > this.x;
            if (top && left) this.topLeft._insert(this.objects[0]);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(this.objects[0]);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(this.objects[0]);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(this.objects[0]);

            top = this.objects[1].y - this.objects[1].radiH < this.y;
            bottom = this.objects[1].y + this.objects[1].radiH > this.y;
            left = this.objects[1].x - this.objects[1].radiW < this.x;
            right = this.objects[1].x + this.objects[1].radiW > this.x;
            if (top && left) this.topLeft._insert(this.objects[1]);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(this.objects[1]);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(this.objects[1]);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(this.objects[1]);

            top = this.objects[2].y - this.objects[2].radiH < this.y;
            bottom = this.objects[2].y + this.objects[2].radiH > this.y;
            left = this.objects[2].x - this.objects[2].radiW < this.x;
            right = this.objects[2].x + this.objects[2].radiW > this.x;
            if (top && left) this.topLeft._insert(this.objects[2]);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(this.objects[2]);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(this.objects[2]);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(this.objects[2]);

            top = this.objects[3].y - this.objects[3].radiH < this.y;
            bottom = this.objects[3].y + this.objects[3].radiH > this.y;
            left = this.objects[3].x - this.objects[3].radiW < this.x;
            right = this.objects[3].x + this.objects[3].radiW > this.x;
            if (top && left) this.topLeft._insert(this.objects[3]);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(this.objects[3]);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(this.objects[3]);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(this.objects[3]);

            top = this.objects[4].y - this.objects[4].radiH < this.y;
            bottom = this.objects[4].y + this.objects[4].radiH > this.y;
            left = this.objects[4].x - this.objects[4].radiW < this.x;
            right = this.objects[4].x + this.objects[4].radiW > this.x;
            if (top && left) this.topLeft._insert(this.objects[4]);
            /** @ts-ignore */
            if (top && right) this.topRight._insert(this.objects[4]);
            /** @ts-ignore */
            if (bottom && left) this.bottomLeft._insert(this.objects[4]);
            /** @ts-ignore */
            if (bottom && right) this.bottomRight._insert(this.objects[4]);
        }
    }

    protected _retrieve(x: number, y: number, radiW: number, radiH: number): Range<T>[] {
        if (this.topLeft) {
            let out: Range<T>[] = [];
            const top = y - radiH < this.y,
                bottom = y + radiH > this.y,
                left = x - radiW < this.x,
                right = x + radiW > this.x;

            if (top && left) out = out.concat(this.topLeft._retrieve(x, y, radiW, radiH));
            /** @ts-ignore */
            if (top && right) out = out.concat(this.topRight._retrieve(x, y, radiW, radiH));
            /** @ts-ignore */
            if (bottom && left) out = out.concat(this.bottomLeft._retrieve(x, y, radiW, radiH));
            /** @ts-ignore */
            if (bottom && right) out = out.concat(this.bottomRight._retrieve(x, y, radiW, radiH));
            
            return out;
        } else return this.objects;
    }
}

export default class DiepQuadTree extends QuadTreeNode<ObjectEntity> implements CollisionManager {
    public constructor(radiW: number, radiH: number) {
        super(0, 0, radiW, radiH, 0);
    }
    public insertEntity(entity: ObjectEntity) {
        this._insert({
            content: entity,
            x: entity.position.values.x,
            y: entity.position.values.y,
            radiW: entity.physics.values.sides === 2 ? entity.physics.values.size / 2 : entity.physics.values.size,
            radiH: entity.physics.values.sides === 2 ? entity.physics.values.width / 2 : entity.physics.values.size,
        });
    }

    public retrieve(x: number, y: number, radiW: number, radiH: number): ObjectEntity[] {
        const ranges = this._retrieve(x, y, radiW, radiH);

        const entities: ObjectEntity[] = [];

        for (let i = 0; i < ranges.length; ++i) {
            if (ranges[i].content.hash !== 0 && !entities.includes(ranges[i].content)) entities.push(ranges[i].content);
        }

        return entities;
    }

    public retrieveEntitiesByEntity(entity: ObjectEntity): ObjectEntity[] {
        return this.retrieve(entity.position.values.x,
            entity.position.values.y,
            entity.physics.values.sides === 2 ? entity.physics.values.size / 2 : entity.physics.values.size,
            entity.physics.values.sides === 2 ? entity.physics.values.width / 2 : entity.physics.values.size);
    }

    public reset(bottomY: number, rightX: number) {
        this.bottomRight = this.bottomLeft = this.topLeft = this.topRight = null;
        this.radiW = rightX;
        this.objects = [];
        this.radiH = bottomY;
    }
}