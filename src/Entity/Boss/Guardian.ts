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
import Barrel from "../Tank/Barrel";
import AbstractBoss from "./AbstractBoss";

import { Colors, Tank } from "../../Const/Enums";
import { AIState } from "../AI";
import { BarrelDefinition } from "../../Const/TankDefinitions";

const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 100,
    width: 71.4,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 24,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 21 / (71.4 / 2),
        health: 12.5,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};

// The size of Guardian by default
const GUARDIAN_SIZE = 135;

/**
 * Class which represents the boss "Guardian"
 */
export default class Guardian extends AbstractBoss {
    public constructor(game: GameServer) {
        super(game);

        this.name.values.name = 'Guardian';
        this.altName = 'Guardian of the Pentagons';
        this.style.values.color = Colors.EnemyCrasher;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physics.values.sides = 3;
        this.sizeFactor = 1.0;

        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition));
    }

    protected moveAroundMap() {
        super.moveAroundMap();
        this.position.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x)
    }

    public tick(tick: number) {
        super.tick(tick);
        // Let it scale with the guardian
        this.sizeFactor = (this.physics.values.size / Math.SQRT1_2) / GUARDIAN_SIZE;
    }
}
