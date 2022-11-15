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

import { Colors, NametagFlags, Tank, Stat } from "../../Const/Enums";
import ArenaEntity from "../../Native/Arena";
import { CameraEntity } from "../../Native/Camera";
import { AI, AIState, Inputs } from "../AI";
import LivingEntity from "../Live";
import Bullet from "../Tank/Projectile/Bullet";
import TankBody from "../Tank/TankBody";
import TeamBase from "./TeamBase";

/**
 * Mothership Tank
 */
export default class Mothership extends TankBody {
    /** Size of a Mothership */
    public static SIZE = 200;

    /** The AI that controls how the Mothership aims. */
    public ai: AI;


    public constructor(arena: ArenaEntity) {


        const inputs = new Inputs();
        const camera = new CameraEntity(arena.game);

        camera.setLevel(140);
        camera.sizeFactor = (Mothership.SIZE / 50);

        super(arena.game, camera, inputs);

        this.relations.values.team = arena;
        this.physics.values.size = Mothership.SIZE;
        // TODO(ABC):
        // Add setTeam method for this
        this.style.values.color = Colors.Neutral;

        this.ai = new AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = 2000;
        
        this.position.values.x = 0;
        this.position.values.y = 0;
        
        this.setTank(Tank.Mothership);
        
        this.name.values.name = "Mothership"
        
        this.scoreReward = 0;
        
        camera.camera.values.player = this;

        for (let i = Stat.MovementSpeed; i < Stat.HealthRegen; ++i) camera.camera.values.statLevels.values[i] = 7;
        camera.camera.values.statLevels.values[Stat.HealthRegen] = 1;

        const def = (this.definition = Object.assign({}, this.definition));
        def.maxHealth = 7000 - 418;
    }


    public tick(tick: number) {
        if (!this.barrels.length) return super.tick(tick)
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
