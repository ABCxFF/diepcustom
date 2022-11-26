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
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";
import AbstractBoss from "./AbstractBoss";

import { Colors, Tank, MotionFlags } from "../../Const/Enums";
import { AIState } from "../AI";

import { BarrelDefinition } from "../../Const/TankDefinitions";
import { PI2 } from "../../util";

/**
 * Definitions (stats and data) of the mounted turret on Defender
 *
 * Defender's gun
 */
const MountedTurretDefinition: BarrelDefinition = {
    ...AutoTurretDefinition,
    bullet: {
        ...AutoTurretDefinition.bullet,
        speed: 2,
        damage: 0.75,
        health: 12.5,
        color: Colors.Neutral
    }
};

/**
 * Definitions (stats and data) of the trap launcher on Defender
 */
const DefenderDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 120,
    width: 71.4,
    delay: 0,
    reload: 4,
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
        speed: 3,
        scatterRate: 1,
        lifeLength: 5,
        absorbtionFactor: 1,
        color: Colors.Neutral
    }
}

// The size of a Defender by default
const DEFENDER_SIZE = 150;

/**
 * Class which represents the boss "Defender"
 */
export default class Defender extends AbstractBoss {

    /** Defender's trap launchers */
    private trappers: Barrel[] = [];
    /** See AbstractBoss.movementSpeed */
    public movementSpeed = 0.35;

    public constructor(game: GameServer) {
        super(game);
        this.name.values.name = 'Defender';
        this.style.values.color = Colors.EnemyTriangle;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physics.values.sides = 3;

        for (let i = 0; i < 3; ++i) {
            // Add trap launcher
            this.trappers.push(new Barrel(this, {
                ...DefenderDefinition,
                angle: PI2 * ((i / 3) - 1 / 6)
            }));

            // TODO:
            // Maybe make this into a class of itself - DefenderAutoTurret
            const base = new AutoTurret(this, MountedTurretDefinition);
            base.influencedByOwnerInputs = true;

            const angle = base.ai.inputs.mouse.angle = PI2 * (i / 3);

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

       this.sizeFactor = (this.physics.values.size / Math.SQRT1_2) / DEFENDER_SIZE;
        if (this.ai.state !== AIState.possessed) {
            this.position.angle += this.ai.passiveRotation * 1.5;
        }
    }
}
