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

import { Color, Tank, PositionFlags } from "../../Const/Enums";
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
        speed: 2.3,
        damage: 0.75,
        health: 12.5,
        color: Color.Neutral
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
        speed: 5,
        scatterRate: 1,
        lifeLength: 8,
        absorbtionFactor: 1,
        color: Color.Neutral
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
        this.nameData.values.name = 'Defender';
        this.styleData.values.color = Color.EnemyTriangle;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 3;

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

            base.positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 0.6;
            base.positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 0.6;

            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.physicsData.values.size * Math.sin(angle) * 0.6;
                base.positionData.x = this.physicsData.values.size * Math.cos(angle) * 0.6;

                tickBase.call(base, tick);
            }
        }
    }

    public tick(tick: number) {
       super.tick(tick);

       this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / DEFENDER_SIZE;
        if (this.ai.state !== AIState.possessed) {
            this.positionData.angle += this.ai.passiveRotation * Math.PI * Math.SQRT1_2;
        }
    }
}
