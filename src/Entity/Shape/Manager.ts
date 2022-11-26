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

import ArenaEntity from "../../Native/Arena";
import GameServer from "../../Game";

import Crasher from "./Crasher";
import Pentagon from "./Pentagon";
import Triangle from "./Triangle";
import Square from "./Square";
import AbstractShape from "./AbstractShape";

/**
 * Used to balance out shape count in the arena, as well
 * as determines where each type of shape spawns around the arena.
 */
export default class ShapeManager {
    /** Current game server */
    protected game: GameServer;
    /** Arena whose shapes are being managed */
    protected arena: ArenaEntity;

    public constructor(arena: ArenaEntity) {
        this.arena = arena;
        this.game = arena.game;
    }

    /**
     * Spawns a shape in a random location on the map.
     * Determines shape type by the random position chosen.
     */
    protected spawnShape(): AbstractShape {
        let shape: AbstractShape;
        const {x, y} = this.arena.findSpawnLocation();
        const rightX = this.arena.arena.values.rightX;
        const leftX = this.arena.arena.values.leftX;
        if (Math.max(x, y) < rightX / 10 && Math.min(x, y) > leftX / 10) {
            // Pentagon Nest
            shape = new Pentagon(this.game, Math.random() <= 0.05);

            shape.position.values.x = x;
            shape.position.values.y = y;
            shape.relations.values.owner = shape.relations.values.team = this.arena;
        } else if (Math.max(x, y) < rightX / 5 && Math.min(x, y) > leftX / 5) {
            // Crasher Zone
            const isBig = Math.random() < .2;

            shape = new Crasher(this.game, isBig);
            
            shape.position.values.x = x;
            shape.position.values.y = y;
            shape.relations.values.owner = shape.relations.values.team = this.arena;
        } else {
            // Fields of Shapes
            const rand = Math.random();
            if (rand < .04) {
                shape = new Pentagon(this.game);

                shape.position.values.x = x;
                shape.position.values.y = y;
                shape.relations.values.owner = shape.relations.values.team = this.arena;
            } else if (rand < .20) { // < 16%
                shape = new Triangle(this.game);

                shape.position.values.x = x;
                shape.position.values.y = y;
                shape.relations.values.owner = shape.relations.values.team = this.arena;
            } else { // if rand < 80%
                shape = new Square(this.game);

                shape.position.values.x = x;
                shape.position.values.y = y;
                shape.relations.values.owner = shape.relations.values.team = this.arena;
            }
        }

        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;

        return shape;
        // this.shapeCount += 1;
    }

    /** Kills all shapes in the arena */
    public killAll() {
        const entities = this.game.entities.inner;
        const lastId = this.game.entities.lastId;
        for (let id = 0; id <= lastId; ++id) {
            const entity = entities[id];
            if (entity instanceof AbstractShape) entity.delete();
        }
        // this.shapeCount = 0;
    }

    protected get wantedShapes() {
        return 1000;
    }

    public tick() {
        const wantedShapes = this.wantedShapes;

        let count = 0;
        for (let id = 1; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];

            if (entity instanceof AbstractShape) {
                count += 1;
            }
        }

        // // TODO(ABC):
        // // Remove this once anti multiboxing starts / when 0x02 is built
        // if (count >= wantedShapes * 10) {
        //     count = 0;
        //     this.killAll();
        // }

        while (count < wantedShapes) {
            this.spawnShape();
            count += 1;
        }
    }
}