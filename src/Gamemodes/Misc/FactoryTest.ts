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
import ArenaEntity from "../../Native/Arena";

import ShapeManager from "../../Entity/Shape/Manager";
import { Inputs } from "../../Entity/AI";
import { CameraEntity } from "../../Native/Camera";
import TankBody from "../../Entity/Tank/TankBody";
import { Colors, ObjectFlags, StyleFlags, Tank } from "../../Const/Enums";
import { SandboxShapeManager } from "../Sandbox";
import Client from "../../Client";

/**
 * Sandbox Gamemode Arena
 */
export default class FactoryTestArena extends ArenaEntity {
    /** Limits shape count to floor(12.5 * player count) */
	protected shapes: ShapeManager = new SandboxShapeManager(this);

    /** The Fac */
    private nimdac: TankBody;

    public constructor(game: GameServer) {
        super(game);

		this.updateBounds(2500, 2500);

		const nimdac = this.nimdac = new TankBody(this.game, new CameraEntity(this.game), new Inputs());

        nimdac.cameraEntity.camera.player = nimdac;
        nimdac.setTank(Tank.Factory);
        nimdac.barrels[0].droneCount = 6;
        nimdac.style.styleFlags &= ~StyleFlags.invincibility;
        nimdac.physics.objectFlags |= ObjectFlags.base;
        /* @ts-ignore */
        nimdac.damageReduction = 0;
        /* @ts-ignore */
        nimdac.damagePerTick = 0;
        Object.defineProperty(nimdac, "damagePerTick", {
            get() {
                return 0;
            },
            set() {}
        });
        nimdac.physics.values.pushFactor = 50;
        nimdac.physics.absorbtionFactor = 0.0;
        nimdac.cameraEntity.setLevel(150);
        nimdac.style.color = Colors.Neutral;
        nimdac.name.name = "The Factory"
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        if (!this.nimdac || !this.nimdac.barrels[0]) {
            return super.spawnPlayer(tank, client);
        }

        const {x, y} = this.nimdac.getWorldPosition();
        const barrel = this.nimdac.barrels[0];
        const shootAngle = barrel.definition.angle + this.nimdac.position.values.angle

        tank.position.values.x = x + (Math.cos(shootAngle) * barrel.physics.values.size * 0.5) - Math.sin(shootAngle) * barrel.definition.offset * this.nimdac.sizeFactor;
        tank.position.values.y = y + (Math.sin(shootAngle) * barrel.physics.values.size * 0.5) + Math.cos(shootAngle) * barrel.definition.offset * this.nimdac.sizeFactor;
        tank.addAcceleration(shootAngle, 40);
    }

    public tick(tick: number) {
		const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
		if (this.width !== arenaSize || this.height !== arenaSize) this.updateBounds(arenaSize, arenaSize);
        if (this.nimdac && this.nimdac.inputs) {
            this.nimdac.inputs.mouse.magnitude = 5;
            this.nimdac.inputs.mouse.angle += 0.03;
        }
        super.tick(tick);
    }
}