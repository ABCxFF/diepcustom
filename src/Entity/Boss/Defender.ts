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
import AutoTurret from "../Tank/AutoTurret";
import AbstractBoss from "./AbstractBoss";

import { Colors, Tank, MotionFlags } from "../../Const/Enums";
import { AIState } from "../AI";

import { BarrelDefinition } from "../../Const/TankDefinitions";

/**
 * Class which represents the boss "Defender"
 */
        const MountedTurretDefinition: BarrelDefinition = {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 1,
            recoil: 0.3,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
        bullet: {
            type: "bullet",
            health: 1,
            damage: 0.4,
            speed: 1.2,
            scatterRate: 1,
            lifeLength: 1,
            sizeRatio: 1,
            absorbtionFactor: 1,
            color: 12
        }
};
const DefenderDefinition: BarrelDefinition = {
            angle: Math.PI,
            offset: 0,
            size: 120 * 2 / (1.01 ** (75 - 1)),
            width: 71.4 * 2 / (1.01 ** (75 - 1)),
            delay: 0,
            reload: 4.5,
            recoil: 2,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: "trapLauncher",
            forceFire: true,
            bullet: {
                type: "trap",
                sizeRatio: 0.8,
                health: 12.5,
                damage: 4,
                speed: 2.5,
                scatterRate: 1,
                lifeLength: 3.2,
                absorbtionFactor: 1,
                color: 12
            }
}

export default class Defender extends AbstractBoss {

    private DefenderTrapper: Barrel[];

    public movementSpeed = 0.35;

    public constructor(game: GameServer) {
        super(game);
        this.name.values.name = 'Defender';
        this.style.values.color = Colors.EnemyTriangle;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = 150 * Math.SQRT1_2;
        this.physics.values.sides = 3;

        this.scaleFactor = 0.5;
   
        const DefenderTrapper: Barrel[] = this.DefenderTrapper =[];

        const x1 = new Barrel(this, {...DefenderDefinition});
        const x2Definition = {...DefenderDefinition};
        x2Definition.angle = Math.PI * 2 * (1 / 6)
        const x2 = new Barrel(this, x2Definition);
        const x3Definition = {...DefenderDefinition};
        x3Definition.angle = Math.PI * 2 * (5 / 6)
        const x3 = new Barrel(this, x3Definition);

        DefenderTrapper.push(x1, x2);

        for (let i = 0; i < 3; ++i) {
            const base = new AutoTurret(this, MountedTurretDefinition);

            const angle = base.ai.inputs.mouse.angle = Math.PI * 2 * (i / 3);

            base.position.values.y = this.physics.values.size * Math.sin(angle) * 0.6;
            base.position.values.x = this.physics.values.size * Math.cos(angle) * 0.6;

            base.physics.values.objectFlags |= MotionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.position.y = this.physics.values.size * Math.sin(angle) * 0.6;
                base.position.x = this.physics.values.size * Math.cos(angle) * 0.6;

                tickBase.call(base, tick);
            }
        }
    }

    public tick(tick: number) {
       super.tick(tick);

        if (this.ai.state !== AIState.possessed) {
            this.inputs.flags = 0;
            this.position.angle += this.ai.passiveRotation;
        }
    }
}