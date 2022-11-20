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

import { HealthbarFlags, ObjectFlags, StyleFlags } from "../../Const/Enums";
import { TeamGroupEntity } from "./TeamEntity";
import LivingEntity from "../Live";
/**
 * Represents Team Bases in game.
 */
export default class TeamBase extends LivingEntity {

    constructor(game: GameServer, team: TeamGroupEntity, x: number, y: number, width: number, height: number, painful: boolean=true) {
        super(game);

        this.relations.values.team = team;

        this.position.values.x = x;
        this.position.values.y = y;

        this.physics.values.width = width;
        this.physics.values.size = height;
        this.physics.values.sides = 2;
        this.physics.values.objectFlags |= ObjectFlags.minimap | ObjectFlags.noOwnTeamCollision | ObjectFlags.base;
        this.physics.values.pushFactor = 2;
        this.damagePerTick = 5;

        if (!painful) {
            this.physics.values.pushFactor = 0;
            this.damagePerTick = 0;
        }

        this.damageReduction = 0;
        this.physics.values.absorbtionFactor = 0;

        this.style.values.opacity = 0.1;
        this.style.values.borderThickness = 0;
        this.style.values.color = team.team.teamColor;
        this.style.values.styleFlags |= StyleFlags.minimap2 | StyleFlags.noDmgIndicator;

        this.health.healthbar |= HealthbarFlags.hidden
        this.health.health = this.health.values.maxHealth = 0xABCFF;
    }

    public tick(tick: number) {
        // No animation. No regen
        this.lastDamageTick = tick;
    }
}
