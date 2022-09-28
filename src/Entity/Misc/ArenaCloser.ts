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

import GameServer from "../../Game";
import TankBody from "../Tank/TankBody";

import { Colors, HealthbarFlags, MotionFlags, Stat, Tank } from "../../Const/Enums";
import { CameraEntity } from "../../Native/Camera";
import { AI, AIState, Inputs } from "../AI";

/**
 * Represents the Arena Closers that end the game.
 */
export default class ArenaCloser extends TankBody {
    /** Size of a level 0 Arena Closer. */
    public static BASE_SIZE = 175;
    
    /** The AI that controls how the AC moves. */
    public ai: AI;

    public constructor(game: GameServer) {
        const inputs = new Inputs();
        const camera = new CameraEntity(game);

        const setLevel = camera.setLevel;
        camera.setLevel = function(level) {
            setLevel.call(this, level);

            this.sizeFactor *= (ArenaCloser.BASE_SIZE / 50);
        }
        camera.sizeFactor = (ArenaCloser.BASE_SIZE / 50);

        super(game, camera, inputs);

        this.relations.values.team = game.arena;

        this.ai = new AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = Infinity;

        this.health.values.healthbar |= HealthbarFlags.hidden;

        this.setTank(Tank.ArenaCloser);

        const def = (this.definition = Object.assign({}, this.definition));
        def.maxHealth = 10000;
        // TODO(ABC):
        // Fix all the stats
        def.speed = 1;

        this.damageReduction = 0;
        this.damagePerTick = 200;

        this.name.values.name = "Arena Closer";
        this.physics.values.absorbtionFactor = 0;
        this.style.values.color = Colors.Neutral;
        this.position.values.motion |= MotionFlags.canMoveThroughWalls
        camera.camera.values.player = this;

        for (let i = Stat.MovementSpeed; i < Stat.BodyDamage; ++i) camera.camera.values.statLevels.values[i] = 7;

        this.ai.aimSpeed = this.barrels[0].bulletAccel * 1.6;
    }

    public tick(tick: number) {
        this.ai.movementSpeed = this.cameraEntity.camera.values.movementSpeed * 10;

        this.inputs = this.ai.inputs;

        if (this.ai.state === AIState.idle) {
            const angle = this.position.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.position.values.x) ** 2 + (this.inputs.mouse.y - this.position.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.position.values.x + Math.cos(angle) * mag,
                y: this.position.values.y + Math.sin(angle) * mag
            });
        }

        super.tick(tick);
    }
}