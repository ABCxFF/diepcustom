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
 * UNDOCUMENTED FILE.
 * 
 * FOR THE SAKE OF SIMPLICITY, THIS FILE IS NOT DOCUMENTED.
 * CONTACT ABC FOR INFORMATION
 * 
 **/

import { Entity, FieldGroupID } from "./Entity";
import { Colors, Tank } from "../Const/Enums";

export type fieldGroupProp = ("relations" | "barrel" | "physics" | "health" | "unused" | "arena" | "name" | "camera" | "position" | "style" | "score" | "team");

export type RelationField = "parent" | "owner" | "team";

export class RelationsGroup {
    entity: Entity;
    fields: RelationField[];
    state: Record<RelationField, number>;
    values: {
        parent: Entity | null,
        owner: Entity | null
        team: Entity | null
    };

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.relations);

        this.entity = entity;

        this.fields = ["parent", "owner", "team"];

        this.state = {
            parent: 0,
            owner: 0,
            team: 0
        }

        this.values = {
            parent: null,
            owner: null,
            team: null
        }
    }

    findUpdate() {
        const out: RelationField[] = [];

        if (this.state.parent) out.push("parent");
        if (this.state.owner) out.push("owner");
        if (this.state.team) out.push("team");

        return out;
    }

    wipe() {
        this.state.parent = 0;
        this.state.owner = 0;
        this.state.team = 0;
    }

    get parent() {
        return this.values.parent;
    }
    set parent(parent) {
        if (parent == this.values.parent) return;
        
        this.state.parent |= 1;
        this.entity.state |= 1;
        this.values.parent = parent;
    }

    get owner() {
        return this.values.owner;
    }
    set owner(owner) {
        if (owner == this.values.owner) return;
        
        this.state.owner |= 1;
        this.entity.state |= 1;
        this.values.owner = owner;
    }

    get team() {
        return this.values.team;
    }
    set team(team) {
        if (team == this.values.team) return;
        
        this.state.team |= 1;
        this.entity.state |= 1;
        this.values.team = team;
    }
}

export type BarrelField = "shooting" | "reloadTime" | "trapezoidalDir";

export class BarrelGroup {
    entity: Entity;
    fields: BarrelField[];
    state: Record<BarrelField, number>;
    values: {
        shooting: number,
        reloadTime: number,
        trapezoidalDir: number
    };

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.barrel);

        this.entity = entity;

        this.fields = ["shooting", "reloadTime", "trapezoidalDir"];

        this.state = {
            shooting: 0,
            reloadTime: 0,
            trapezoidalDir: 0
        }

        this.values = {
            shooting: 0,
            reloadTime: 15,
            trapezoidalDir: 0
        }
    }

    findUpdate() {
        const out: BarrelField[] = [];

        if (this.state.shooting) out.push("shooting");
        if (this.state.reloadTime) out.push("reloadTime");
        if (this.state.trapezoidalDir) out.push("trapezoidalDir");

        return out;
    }

    wipe() {
        this.state.shooting = 0;
        this.state.reloadTime = 0;
        this.state.trapezoidalDir = 0;
    }

    get shooting() {
        return this.values.shooting;
    }
    set shooting(shooting) {
        if (shooting == this.values.shooting) return;
        
        this.state.shooting |= 1;
        this.entity.state |= 1;
        this.values.shooting = shooting;
    }

    get reloadTime() {
        return this.values.reloadTime;
    }
    set reloadTime(reloadTime) {
        if (reloadTime == this.values.reloadTime) return;
        
        this.state.reloadTime |= 1;
        this.entity.state |= 1;
        this.values.reloadTime = reloadTime;
    }

    get trapezoidalDir() {
        return this.values.trapezoidalDir;
    }
    set trapezoidalDir(trapezoidalDir) {
        if (trapezoidalDir == this.values.trapezoidalDir) return;
        
        this.state.trapezoidalDir |= 1;
        this.entity.state |= 1;
        this.values.trapezoidalDir = trapezoidalDir;
    }
}

export type PhysicsField = "objectFlags" | "sides" | "size" | "width" | "absorbtionFactor" | "pushFactor";

export class PhysicsGroup {
    // Used for the spatial hashing to prevent duplicates.
    queryId: number = -1;

    entity: Entity;
    fields: PhysicsField[];
    state: Record<PhysicsField, number>;
    values: {
        objectFlags: number,
        sides: number,
        size: number,
        width: number,
        absorbtionFactor: number,
        pushFactor: number
    };

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.physics);

        this.entity = entity;

        this.fields = ["objectFlags", "sides", "size", "width", "absorbtionFactor", "pushFactor"];

        this.state = {
            objectFlags: 0,
            sides: 0,
            size: 0,
            width: 0,
            absorbtionFactor: 0,
            pushFactor: 0
        }

        this.values = {
            objectFlags: 0,
            sides: 0,
            size: 0,
            width: 0,
            absorbtionFactor: 1,
            pushFactor: 8
        }
    }

    findUpdate() {
        const out: PhysicsField[] = [];

        if (this.state.objectFlags) out.push("objectFlags");
        if (this.state.sides) out.push("sides");
        if (this.state.size) out.push("size");
        if (this.state.width) out.push("width");
        if (this.state.absorbtionFactor) out.push("absorbtionFactor");
        if (this.state.pushFactor) out.push("pushFactor");

        return out;
    }

    wipe() {
        this.state.objectFlags = 0;
        this.state.sides = 0;
        this.state.size = 0;
        this.state.width = 0;
        this.state.absorbtionFactor = 0;
        this.state.pushFactor = 0;
    }

    get objectFlags() {
        return this.values.objectFlags;
    }
    set objectFlags(objectFlags) {
        if (objectFlags == this.values.objectFlags) return;
        
        this.state.objectFlags |= 1;
        this.entity.state |= 1;
        this.values.objectFlags = objectFlags;
    }

    get sides() {
        return this.values.sides;
    }
    set sides(sides) {
        if (sides == this.values.sides) return;
        
        this.state.sides |= 1;
        this.entity.state |= 1;
        this.values.sides = sides;
    }

    get size() {
        return this.values.size;
    }
    set size(size) {
        if (size == this.values.size) return;
        
        this.state.size |= 1;
        this.entity.state |= 1;
        this.values.size = size;
    }

    get width() {
        return this.values.width;
    }
    set width(width) {
        if (width == this.values.width) return;
        
        this.state.width |= 1;
        this.entity.state |= 1;
        this.values.width = width;
    }

    get absorbtionFactor() {
        return this.values.absorbtionFactor;
    }
    set absorbtionFactor(absorbtionFactor) {
        if (absorbtionFactor == this.values.absorbtionFactor) return;
        
        this.state.absorbtionFactor |= 1;
        this.entity.state |= 1;
        this.values.absorbtionFactor = absorbtionFactor;
    }

    get pushFactor() {
        return this.values.pushFactor;
    }
    set pushFactor(pushFactor) {
        if (pushFactor == this.values.pushFactor) return;
        
        this.state.pushFactor |= 1;
        this.entity.state |= 1;
        this.values.pushFactor = pushFactor;
    }
}

export type HealthField = "healthbar" | "health" | "maxHealth";

export class HealthGroup {
    entity: Entity;
    fields: HealthField[];
    state: Record<HealthField, number>;
    values: {
        healthbar: number,
        health: number,
        maxHealth: number
    };

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.health);

        this.entity = entity;

        this.fields = ["healthbar", "health", "maxHealth"];

        this.state = {
            healthbar: 0,
            health: 0,
            maxHealth: 0
        }

        this.values = {
            healthbar: 0,
            health: 1,
            maxHealth: 1
        };
    }

    findUpdate() {
        const out: HealthField[] = [];

        if (this.state.healthbar) out.push("healthbar");
        if (this.state.health) out.push("health");
        if (this.state.maxHealth) out.push("maxHealth");

        return out;
    }

    wipe() {
        this.state.healthbar = 0;
        this.state.health = 0;
        this.state.maxHealth = 0;
    }

    get healthbar() {
        return this.values.healthbar;
    }
    set healthbar(healthbar) {
        if (healthbar == this.values.healthbar) return;
        
        this.state.healthbar |= 1;
        this.entity.state |= 1;
        this.values.healthbar = healthbar;
    }

    get health() {
        return this.values.health;
    }
    set health(health) {
        if (health == this.values.health) return;
        
        this.state.health |= 1;
        this.entity.state |= 1;
        this.values.health = health;
    }

    get maxHealth() {
        return this.values.maxHealth;
    }
    set maxHealth(maxHealth) {
        if (maxHealth == this.values.maxHealth) return;
        
        this.state.maxHealth |= 1;
        this.entity.state |= 1;
        this.values.maxHealth = maxHealth;
    }
}

export type UnusedField = "unknown";

export class UnusedGroup {
    entity: Entity;
    fields: UnusedField[];
    state: Record<UnusedField, number>;
    values: {
        unknown: number
    };

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.unused);

        this.entity = entity;

        this.fields = ["unknown"];

        this.state = {
            unknown: 0
        };

        this.values = {
            unknown: 0
        };
    }

    findUpdate() {
        const out: UnusedField[] = [];

        if (this.state.unknown) out.push("unknown");

        return out;
    }

    wipe() {
        this.state.unknown = 0;
    }

    get unknown() {
        return this.values.unknown;
    }
    set unknown(unknown) {
        if (unknown == this.values.unknown) return;
        
        this.state.unknown |= 1;
        this.entity.state |= 1;
        this.values.unknown = unknown;
    }
}

export type ArenaField = "GUI" | "leftX" | "topY" | "rightX" | "bottomY" | "scoreboardAmount" | "scoreboardNames" | "scoreboardScores" | "scoreboardColors" | "scoreboardSuffixes" | "scoreboardTanks" | "leaderX" | "leaderY" | "playersNeeded" | "ticksUntilStart";

export class ScoreboardTable<ValueType> {
    state: Uint8Array;
    values: ValueType[];
    owner: ArenaGroup;
    fieldName: ArenaField

    constructor(defaultValue: ValueType, fieldName: ArenaField, owner: ArenaGroup) {
        this.state = new Uint8Array(10);
        this.values = Array(10).fill(defaultValue);
        this.fieldName = fieldName;
        this.owner = owner;
    }

    get [0]() {
        return this.values[0];
    }
    set [0](value) {
        if (value == this.values[0]) return;
            
        this.state[0] |= 1;
        this.values[0] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [1]() {
        return this.values[1];
    }
    set [1](value) {
        if (value == this.values[1]) return;
            
        this.state[1] |= 1;
        this.values[1] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [2]() {
        return this.values[2];
    }
    set [2](value) {
        if (value == this.values[2]) return;
            
        this.state[2] |= 1;
        this.values[2] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [3]() {
        return this.values[3];
    }
    set [3](value) {
        if (value == this.values[3]) return;
            
        this.state[3] |= 1;
        this.values[3] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [4]() {
        return this.values[4];
    }
    set [4](value) {
        if (value == this.values[4]) return;
            
        this.state[4] |= 1;
        this.values[4] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [5]() {
        return this.values[5];
    }
    set [5](value) {
        if (value == this.values[5]) return;
            
        this.state[5] |= 1;
        this.values[5] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [6]() {
        return this.values[6];
    }
    set [6](value) {
        if (value == this.values[6]) return;
            
        this.state[6] |= 1;
        this.values[6] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [7]() {
        return this.values[7];
    }
    set [7](value) {
        if (value == this.values[7]) return;
            
        this.state[7] |= 1;
        this.values[7] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [8]() {
        return this.values[8];
    }
    set [8](value) {
        if (value == this.values[8]) return;
            
        this.state[8] |= 1;
        this.values[8] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [9]() {
        return this.values[9];
    }
    set [9](value) {
        if (value == this.values[9]) return;
            
        this.state[9] |= 1;
        this.values[9] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    

    findUpdate(): number[] {
        return this.state.reduce((out: number[], v, i) => {
            if (v) out.push(i);

            return out;
        }, []);
    }
}

export class ArenaGroup {
    entity: Entity;
    fields: ArenaField[];
    state: Record<ArenaField, number>;
    values: {
        GUI: number,
        leftX: number,
        topY: number,
        rightX: number,
        bottomY: number,
        scoreboardAmount: number,
        scoreboardNames: ScoreboardTable<string>,
        scoreboardScores: ScoreboardTable<number>,
        scoreboardColors: ScoreboardTable<Colors>,
        scoreboardSuffixes: ScoreboardTable<string>,
        scoreboardTanks: ScoreboardTable<Tank>,
        leaderX: number,
        leaderY: number,
        playersNeeded: number,
        ticksUntilStart: number
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.arena);

        this.entity = entity;

        this.fields = ["GUI", "leftX", "topY", "rightX", "bottomY", "scoreboardAmount", "scoreboardNames", "scoreboardScores", "scoreboardColors", "scoreboardSuffixes", "scoreboardTanks", "leaderX", "leaderY", "playersNeeded", "ticksUntilStart"];
        this.state = {
            GUI: 0,
            leftX: 0,
            topY: 0,
            rightX: 0,
            bottomY: 0,
            scoreboardAmount: 0,
            scoreboardNames: 0,
            scoreboardScores: 0,
            scoreboardColors: 0,
            scoreboardSuffixes: 0,
            scoreboardTanks: 0,
            leaderX: 0,
            leaderY: 0,
            playersNeeded: 0,
            ticksUntilStart: 0
        };

        this.values = {
            GUI: 2,
            leftX: 0,
            topY: 0,
            rightX: 0,
            bottomY: 0,
            scoreboardAmount: 0,
            scoreboardNames: new ScoreboardTable("", "scoreboardNames", this),
            scoreboardScores: new ScoreboardTable(0, "scoreboardScores", this),
            scoreboardColors: new ScoreboardTable(Colors.ScoreboardBar, "scoreboardColors", this),
            scoreboardSuffixes: new ScoreboardTable("", "scoreboardSuffixes", this),
            scoreboardTanks: new ScoreboardTable(Tank.Basic, "scoreboardTanks", this),
            leaderX: 0,
            leaderY: 0,
            playersNeeded: 1,
            ticksUntilStart: 250
        }
    }

    findUpdate() {
        const out: ArenaField[] = [];

        if (this.state.GUI) out.push("GUI");
        if (this.state.leftX) out.push("leftX");
        if (this.state.topY) out.push("topY");
        if (this.state.rightX) out.push("rightX");
        if (this.state.bottomY) out.push("bottomY");
        if (this.state.scoreboardAmount) out.push("scoreboardAmount");
        if (this.state.scoreboardNames) out.push("scoreboardNames");
        if (this.state.scoreboardScores) out.push("scoreboardScores");
        if (this.state.scoreboardColors) out.push("scoreboardColors");
        if (this.state.scoreboardSuffixes) out.push("scoreboardSuffixes");
        if (this.state.scoreboardTanks) out.push("scoreboardTanks");
        if (this.state.leaderX) out.push("leaderX");
        if (this.state.leaderY) out.push("leaderY");
        if (this.state.playersNeeded) out.push("playersNeeded");
        if (this.state.ticksUntilStart) out.push("ticksUntilStart");

        return out;
    }

    wipe() {
        this.state.GUI = 0;
        this.state.leftX = 0;
        this.state.topY = 0;
        this.state.rightX = 0;
        this.state.bottomY = 0;
        this.state.scoreboardAmount = 0;
        this.state.scoreboardNames = 0;
        this.state.scoreboardScores = 0;
        this.state.scoreboardColors = 0;
        this.state.scoreboardSuffixes = 0;
        this.state.scoreboardTanks = 0;
        this.state.leaderX = 0;
        this.state.leaderY = 0;
        this.state.playersNeeded = 0;
        this.state.ticksUntilStart = 0;
    }

    get GUI() {
        return this.values.GUI;
    }
    set GUI(GUI) {
        if (GUI == this.values.GUI) return;
        
        this.state.GUI |= 1;
        this.entity.state |= 1;
        this.values.GUI = GUI;
    }

    get leftX() {
        return this.values.leftX;
    }
    set leftX(leftX) {
        if (leftX == this.values.leftX) return;
        
        this.state.leftX |= 1;
        this.entity.state |= 1;
        this.values.leftX = leftX;
    }

    get topY() {
        return this.values.topY;
    }
    set topY(topY) {
        if (topY == this.values.topY) return;
        
        this.state.topY |= 1;
        this.entity.state |= 1;
        this.values.topY = topY;
    }

    get rightX() {
        return this.values.rightX;
    }
    set rightX(rightX) {
        if (rightX == this.values.rightX) return;
        
        this.state.rightX |= 1;
        this.entity.state |= 1;
        this.values.rightX = rightX;
    }

    get bottomY() {
        return this.values.bottomY;
    }
    set bottomY(bottomY) {
        if (bottomY == this.values.bottomY) return;
        
        this.state.bottomY |= 1;
        this.entity.state |= 1;
        this.values.bottomY = bottomY;
    }

    get scoreboardAmount() {
        return this.values.scoreboardAmount;
    }
    set scoreboardAmount(scoreboardAmount) {
        if (scoreboardAmount == this.values.scoreboardAmount) return;
        
        this.state.scoreboardAmount |= 1;
        this.entity.state |= 1;
        this.values.scoreboardAmount = scoreboardAmount;
    }

    // 5 Table fields
    get scoreboardNames() {
        return this.values.scoreboardNames;
    }
    get scoreboardScores() {
        return this.values.scoreboardScores;
    }
    get scoreboardColors() {
        return this.values.scoreboardColors;
    }
    get scoreboardSuffixes() {
        return this.values.scoreboardSuffixes;
    }
    get scoreboardTanks() {
        return this.values.scoreboardTanks;
    }

    get leaderX() {
        return this.values.leaderX;
    }
    set leaderX(leaderX) {
        if (leaderX == this.values.leaderX) return;
        
        this.state.leaderX |= 1;
        this.entity.state |= 1;
        this.values.leaderX = leaderX;
    }

    get leaderY() {
        return this.values.leaderY;
    }
    set leaderY(leaderY) {
        if (leaderY == this.values.leaderY) return;
        
        this.state.leaderY |= 1;
        this.entity.state |= 1;
        this.values.leaderY = leaderY;
    }

    get playersNeeded() {
        return this.values.playersNeeded;
    }
    set playersNeeded(playersNeeded) {
        if (playersNeeded == this.values.playersNeeded) return;
        
        this.state.playersNeeded |= 1;
        this.entity.state |= 1;
        this.values.playersNeeded = playersNeeded;
    }

    get ticksUntilStart() {
        return this.values.ticksUntilStart;
    }
    set ticksUntilStart(ticksUntilStart) {
        if (ticksUntilStart == this.values.ticksUntilStart) return;
        
        this.state.ticksUntilStart |= 1;
        this.entity.state |= 1;
        this.values.ticksUntilStart = ticksUntilStart;
    }
}

export type NameField = "nametag" | "name";

export class NameGroup {
    entity: Entity;
    fields: NameField[];
    state: Record<NameField, number>;
    values: {
        nametag: number,
        name: string
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.name);

        this.entity = entity;

        this.fields = ["nametag", "name"];

        this.state = {
            nametag: 0,
            name: 0
        };

        this.values = {
            nametag: 0,
            name: ""
        };
    }

    findUpdate() {
        const out: NameField[] = [];

        if (this.state.nametag) out.push("nametag");
        if (this.state.name) out.push("name");

        return out;
    }

    wipe() {
        this.state.nametag = 0;
        this.state.name = 0;
    }

    get nametag() {
        return this.values.nametag;
    }
    set nametag(nametag) {
        if (nametag == this.values.nametag) return;
        
        this.state.nametag |= 1;
        this.entity.state |= 1;
        this.values.nametag = nametag;
    }

    get name() {
        return this.values.name;
    }
    set name(name) {
        if (name == this.values.name) return;
        
        this.state.name |= 1;
        this.entity.state |= 1;
        this.values.name = name;
    }
}

export type CameraField = "GUIunknown" | "camera" | "player" | "FOV" | "level" | "tank" | "levelbarProgress" | "levelbarMax" | "statsAvailable" | "statNames" | "statLevels" | "statLimits" | "cameraX" | "cameraY" | "scorebar" | "respawnLevel" | "killedBy" | "spawnTick" | "deathTick" | "tankOverride" | "movementSpeed";

export class CameraTable<ValueType> {
    state: Uint8Array;
    values: ValueType[];
    owner: CameraGroup;
    fieldName: CameraField

    constructor(defaultValue: ValueType, fieldName: CameraField, owner: CameraGroup) {
        this.state = new Uint8Array(8);
        this.values = Array(8).fill(defaultValue);
        this.fieldName = fieldName;
        this.owner = owner;
    }

    get [0]() {
        return this.values[0];
    }
    set [0](value) {
        if (value == this.values[0]) return;
            
        this.state[0] |= 1;
        this.values[0] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [1]() {
        return this.values[1];
    }
    set [1](value) {
        if (value == this.values[1]) return;
            
        this.state[1] |= 1;
        this.values[1] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [2]() {
        return this.values[2];
    }
    set [2](value) {
        if (value == this.values[2]) return;
            
        this.state[2] |= 1;
        this.values[2] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [3]() {
        return this.values[3];
    }
    set [3](value) {
        if (value == this.values[3]) return;
            
        this.state[3] |= 1;
        this.values[3] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [4]() {
        return this.values[4];
    }
    set [4](value) {
        if (value == this.values[4]) return;
            
        this.state[4] |= 1;
        this.values[4] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [5]() {
        return this.values[5];
    }
    set [5](value) {
        if (value == this.values[5]) return;
            
        this.state[5] |= 1;
        this.values[5] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [6]() {
        return this.values[6];
    }
    set [6](value) {
        if (value == this.values[6]) return;
            
        this.state[6] |= 1;
        this.values[6] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    get [7]() {
        return this.values[7];
    }
    set [7](value) {
        if (value == this.values[7]) return;
            
        this.state[7] |= 1;
        this.values[7] = value;

        this.owner.state[this.fieldName] |= 1;
        this.owner.entity.state |= 1;
    }
    
    findUpdate(): number[] {
        return this.state.reduce((out: number[], v, i) => {
            if (v) out.push(i);

            return out;
        }, []);
    }
}

export class CameraGroup {
    entity: Entity;
    fields: CameraField[];
    state: Record<CameraField, number>;
    values: {
        GUIunknown: number,
        camera: number,
        player: Entity | null,
        FOV: number,
        level: number,
        tank: number,
        levelbarProgress: number,
        levelbarMax: number,
        statsAvailable: number,
        statNames: CameraTable<string>,
        statLevels: CameraTable<number>,
        statLimits: CameraTable<number>,
        cameraX: number,
        cameraY: number,
        scorebar: number,
        respawnLevel: number,
        killedBy: string,
        spawnTick: number,
        deathTick: number,
        tankOverride: string,
        movementSpeed: number,
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.camera);

        this.entity = entity;

        this.fields = ["GUIunknown", "camera", "player", "FOV", "level", "tank", "levelbarProgress", "levelbarMax", "statsAvailable", "statNames", "statLevels", "statLimits", "cameraX", "cameraY", "scorebar", "respawnLevel", "killedBy", "spawnTick", "deathTick", "tankOverride", "movementSpeed"]
        this.state = {
            GUIunknown: 0,
            camera: 0,
            player: 0,
            FOV: 0,
            level: 0,
            tank: 0,
            levelbarProgress: 0,
            levelbarMax: 0,
            statsAvailable: 0,
            statNames: 0,
            statLevels: 0,
            statLimits: 0,
            cameraX: 0,
            cameraY: 0,
            scorebar: 0,
            respawnLevel: 0,
            killedBy: 0,
            spawnTick: 0,
            deathTick: 0,
            tankOverride: 0,
            movementSpeed: 0
        }

        this.values = {
            GUIunknown: 2,
            camera: 1,
            player: null,
            FOV: 0.35,
            level: 1,
            tank: 53,
            levelbarProgress: 0,
            levelbarMax: 0,
            statsAvailable: 0,
            statNames: new CameraTable("", "statNames", this),
            statLevels: new CameraTable(0, "statLevels", this),
            statLimits: new CameraTable(0, "statLimits", this),
            cameraX: 0,
            cameraY: 0,
            scorebar: 0,
            respawnLevel: 0,
            killedBy: "",
            spawnTick: 0,
            deathTick: -1,
            tankOverride: "",
            movementSpeed: 0
        }
    }

    findUpdate() {
        const out: CameraField[] = [];

        if (this.state.GUIunknown) out.push("GUIunknown");
        if (this.state.camera) out.push("camera");
        if (this.state.player) out.push("player");
        if (this.state.FOV) out.push("FOV");
        if (this.state.level) out.push("level");
        if (this.state.tank) out.push("tank");
        if (this.state.levelbarProgress) out.push("levelbarProgress");
        if (this.state.levelbarMax) out.push("levelbarMax");
        if (this.state.statsAvailable) out.push("statsAvailable");
        if (this.state.statNames) out.push("statNames");
        if (this.state.statLevels) out.push("statLevels");
        if (this.state.statLimits) out.push("statLimits");
        if (this.state.cameraX) out.push("cameraX");
        if (this.state.cameraY) out.push("cameraY");
        if (this.state.scorebar) out.push("scorebar");
        if (this.state.respawnLevel) out.push("respawnLevel");
        if (this.state.killedBy) out.push("killedBy");
        if (this.state.spawnTick) out.push("spawnTick");
        if (this.state.deathTick) out.push("deathTick");
        if (this.state.tankOverride) out.push("tankOverride");
        if (this.state.movementSpeed) out.push("movementSpeed");

        return out;
    }

    wipe() {
        this.state.GUIunknown = 0;
        this.state.camera = 0;
        this.state.player = 0;
        this.state.FOV = 0;
        this.state.level = 0;
        this.state.tank = 0;
        this.state.levelbarProgress = 0;
        this.state.levelbarMax = 0;
        this.state.statsAvailable = 0;
        this.state.statNames = 0;
        this.state.statLevels = 0;
        this.state.statLimits = 0;
        this.state.cameraX = 0;
        this.state.cameraY = 0;
        this.state.scorebar = 0;
        this.state.respawnLevel = 0;
        this.state.killedBy = 0;
        this.state.spawnTick = 0;
        this.state.deathTick = 0;
        this.state.tankOverride = 0;
        this.state.movementSpeed = 0;
    }

    get GUIunknown() {
        return this.values.GUIunknown;
    }
    set GUIunknown(GUIunknown) {
        if (GUIunknown == this.values.GUIunknown) return;
        
        this.state.GUIunknown |= 1;
        this.entity.state |= 1;
        this.values.GUIunknown = GUIunknown;
    }

    get camera() {
        return this.values.camera;
    }
    set camera(camera) {
        if (camera == this.values.camera) return;
        
        this.state.camera |= 1;
        this.entity.state |= 1;
        this.values.camera = camera;
    }

    get player() {
        return this.values.player;
    }
    set player(player) {
        if (player == this.values.player) return;
        
        this.state.player |= 1;
        this.entity.state |= 1;
        this.values.player = player;
    }

    get FOV() {
        return this.values.FOV;
    }
    set FOV(FOV) {
        if (FOV == this.values.FOV) return;
        
        this.state.FOV |= 1;
        this.entity.state |= 1;
        this.values.FOV = FOV;
    }

    get level() {
        return this.values.level;
    }
    set level(level) {
        if (level == this.values.level) return;
        
        this.state.level |= 1;
        this.entity.state |= 1;
        this.values.level = level;
    }

    get tank() {
        return this.values.tank;
    }
    set tank(tank) {
        if (tank == this.values.tank) return;
        
        this.state.tank |= 1;
        this.entity.state |= 1;
        this.values.tank = tank;
    }

    get levelbarProgress() {
        return this.values.levelbarProgress;
    }
    set levelbarProgress(levelbarProgress) {
        if (levelbarProgress == this.values.levelbarProgress) return;
        
        this.state.levelbarProgress |= 1;
        this.entity.state |= 1;
        this.values.levelbarProgress = levelbarProgress;
    }

    get levelbarMax() {
        return this.values.levelbarMax;
    }
    set levelbarMax(levelbarMax) {
        if (levelbarMax == this.values.levelbarMax) return;
        
        this.state.levelbarMax |= 1;
        this.entity.state |= 1;
        this.values.levelbarMax = levelbarMax;
    }

    get statsAvailable() {
        return this.values.statsAvailable;
    }
    set statsAvailable(statsAvailable) {
        if (statsAvailable == this.values.statsAvailable) return;
        
        this.state.statsAvailable |= 1;
        this.entity.state |= 1;
        this.values.statsAvailable = statsAvailable;
    }

    // 3 Table Fields
    get statNames() {
        return this.values.statNames;
    }
    get statLevels() {
        return this.values.statLevels;
    }
    get statLimits() {
        return this.values.statLimits;
    }

    get cameraX() {
        return this.values.cameraX;
    }
    set cameraX(cameraX) {
        if (cameraX == this.values.cameraX) return;
        
        this.state.cameraX |= 1;
        this.entity.state |= 1;
        this.values.cameraX = cameraX;
    }

    get cameraY() {
        return this.values.cameraY;
    }
    set cameraY(cameraY) {
        if (cameraY == this.values.cameraY) return;
        
        this.state.cameraY |= 1;
        this.entity.state |= 1;
        this.values.cameraY = cameraY;
    }

    get scorebar() {
        return this.values.scorebar;
    }
    set scorebar(scorebar) {
        if (scorebar == this.values.scorebar) return;
        
        this.state.scorebar |= 1;
        this.entity.state |= 1;
        this.values.scorebar = scorebar;
    }

    get respawnLevel() {
        return this.values.respawnLevel;
    }
    set respawnLevel(respawnLevel) {
        if (respawnLevel == this.values.respawnLevel) return;
        
        this.state.respawnLevel |= 1;
        this.entity.state |= 1;
        this.values.respawnLevel = respawnLevel;
    }

    get killedBy() {
        return this.values.killedBy;
    }
    set killedBy(killedBy) {
        if (killedBy == this.values.killedBy) return;
        
        this.state.killedBy |= 1;
        this.entity.state |= 1;
        this.values.killedBy = killedBy;
    }

    get spawnTick() {
        return this.values.spawnTick;
    }
    set spawnTick(spawnTick) {
        if (spawnTick == this.values.spawnTick) return;
        
        this.state.spawnTick |= 1;
        this.entity.state |= 1;
        this.values.spawnTick = spawnTick;
    }

    get deathTick() {
        return this.values.deathTick;
    }
    set deathTick(deathTick) {
        if (deathTick == this.values.deathTick) return;
        
        this.state.deathTick |= 1;
        this.entity.state |= 1;
        this.values.deathTick = deathTick;
    }

    get tankOverride() {
        return this.values.tankOverride;
    }
    set tankOverride(tankOverride) {
        if (tankOverride == this.values.tankOverride) return;
        
        this.state.tankOverride |= 1;
        this.entity.state |= 1;
        this.values.tankOverride = tankOverride;
    }

    get movementSpeed() {
        return this.values.movementSpeed;
    }
    set movementSpeed(movementSpeed) {
        if (movementSpeed == this.values.movementSpeed) return;
        
        this.state.movementSpeed |= 1;
        this.entity.state |= 1;
        this.values.movementSpeed = movementSpeed;
    }
}

export type PositionField = "x" | "y" | "angle" | "motion";

export class PositionGroup {
    entity: Entity;
    fields: PositionField[];
    state: Record<PositionField, number>;
    values: {
        x: number,
        y: number,
        angle: number,
        motion: number
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.position);

        this.entity = entity;

        this.fields = ["x", "y", "angle", "motion"];

        this.state = {
            x: 0,
            y: 0,
            angle: 0,
            motion: 0
        };

        this.values = {
            x: 0,
            y: 0,
            angle: 0,
            motion: 0
        };
    }

    findUpdate() {
        const out: PositionField[] = [];

        if (this.state.x) out.push("x");
        if (this.state.y) out.push("y");
        if (this.state.angle) out.push("angle");
        if (this.state.motion) out.push("motion");

        return out;
    }

    wipe() {
        this.state.x = 0;
        this.state.y = 0;
        this.state.angle = 0;
        this.state.motion = 0;
    }

    get x() {
        return this.values.x;
    }
    set x(x) {
        if (x == this.values.x) return;
        
        this.state.x |= 1;
        this.entity.state |= 1;
        this.values.x = x;
    }

    get y() {
        return this.values.y;
    }
    set y(y) {
        if (y == this.values.y) return;
        
        this.state.y |= 1;
        this.entity.state |= 1;
        this.values.y = y;
    }

    get angle() {
        return this.values.angle;
    }
    set angle(angle) {
        if (angle == this.values.angle) return;
        
        this.state.angle |= 1;
        this.entity.state |= 1;
        this.values.angle = angle;
    }

    get motion() {
        return this.values.motion;
    }
    set motion(motion) {
        if (motion == this.values.motion) return;
        
        this.state.motion |= 1;
        this.entity.state |= 1;
        this.values.motion = motion;
    }
}

export type StyleField = "styleFlags" | "color" | "borderThickness" | "opacity" | "zIndex";

export class StyleGroup {
    entity: Entity;
    fields: StyleField[];
    state: Record<StyleField, number>;
    values: {
        styleFlags: number,
        color: Colors,
        borderThickness: number,
        opacity: number,
        zIndex: number
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.style);

        this.entity = entity;

        this.fields = ["styleFlags", "color", "borderThickness", "opacity", "zIndex"];

        this.state = {
            styleFlags: 0,
            color: 0,
            borderThickness: 0,
            opacity: 0,
            zIndex: 0
        }

        this.values = {
            styleFlags: 1,
            color: Colors.Border,
            borderThickness: 480,
            opacity: 1,
            zIndex: 0
        }
    }

    findUpdate() {
        const out: StyleField[] = [];

        if (this.state.styleFlags) out.push("styleFlags");
        if (this.state.color) out.push("color");
        if (this.state.borderThickness) out.push("borderThickness");
        if (this.state.opacity) out.push("opacity");
        if (this.state.zIndex) out.push("zIndex");

        return out;
    }

    wipe() {
        this.state.styleFlags = 0;
        this.state.color = 0;
        this.state.borderThickness = 0;
        this.state.opacity = 0;
        this.state.zIndex = 0;
    }

    get styleFlags() {
        return this.values.styleFlags;
    }
    set styleFlags(styleFlags) {
        if (styleFlags == this.values.styleFlags) return;
        
        this.state.styleFlags |= 1;
        this.entity.state |= 1;
        this.values.styleFlags = styleFlags;
    }

    get color() {
        return this.values.color;
    }
    set color(color) {
        if (color == this.values.color) return;
        
        this.state.color |= 1;
        this.entity.state |= 1;
        this.values.color = color;
    }

    get borderThickness() {
        return this.values.borderThickness;
    }
    set borderThickness(borderThickness) {
        if (borderThickness == this.values.borderThickness) return;
        
        this.state.borderThickness |= 1;
        this.entity.state |= 1;
        this.values.borderThickness = borderThickness;
    }

    get opacity() {
        return this.values.opacity;
    }
    set opacity(opacity) {
        if (opacity == this.values.opacity) return;
        
        this.state.opacity |= 1;
        this.entity.state |= 1;
        this.values.opacity = opacity;
    }

    get zIndex() {
        return this.values.zIndex;
    }
    set zIndex(zIndex) {
        if (zIndex == this.values.zIndex) return;
        
        this.state.zIndex |= 1;
        this.entity.state |= 1;
        this.values.zIndex = zIndex;
    }
}

export type ScoreField = "score";

export class ScoreGroup {
    entity: Entity;
    fields: ScoreField[];
    state: Record<ScoreField, number>;
    values: {
        score: number
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.score);
        this.entity = entity;

        this.fields = ["score"];

        this.state = {
            score: 0
        };

        this.values = {
            score: 0
        };
    }

    findUpdate() {
        const out: ScoreField[] = [];

        if (this.state.score) out.push("score");

        return out;
    }

    wipe() {
        this.state.score = 0;
    }

    get score() {
        return this.values.score;
    }
    set score(score) {
        if (score == this.values.score) return;
        
        this.state.score |= 1;
        this.entity.state |= 1;
        this.values.score = score;
    }
}

export type TeamField = "teamColor" | "mothershipX" | "mothershipY" | "mothership";

export class TeamGroup {
    entity: Entity;
    fields: TeamField[];
    state: Record<TeamField, number>;
    values: {
        teamColor: Colors,
        mothershipX: number,
        mothershipY: number,
        mothership: number
    }

    constructor(entity: Entity) {
        entity.fieldGroups.push(FieldGroupID.team);

        this.entity = entity;

        this.fields = ["teamColor", "mothershipX", "mothershipY", "mothership"];

        this.state = {
            teamColor: 0,
            mothershipX: 0,
            mothershipY: 0,
            mothership: 0
        };

        this.values = {
            teamColor: Colors.Border,
            mothershipX: 0,
            mothershipY: 0,
            mothership: 0
        };
    }

    findUpdate() {
        const out: TeamField[] = [];

        if (this.state.teamColor) out.push("teamColor");
        if (this.state.mothershipX) out.push("mothershipX");
        if (this.state.mothershipY) out.push("mothershipY");
        if (this.state.mothership) out.push("mothership");

        return out;
    }

    wipe() {
        this.state.teamColor = 0;
        this.state.mothershipX = 0;
        this.state.mothershipY = 0;
        this.state.mothership = 0;
    }

    get teamColor() {
        return this.values.teamColor;
    }
    set teamColor(teamColor) {
        if (teamColor == this.values.teamColor) return;
        
        this.state.teamColor |= 1;
        this.entity.state |= 1;
        this.values.teamColor = teamColor;
    }

    get mothershipX() {
        return this.values.mothershipX;
    }
    set mothershipX(mothershipX) {
        if (mothershipX == this.values.mothershipX) return;
        
        this.state.mothershipX |= 1;
        this.entity.state |= 1;
        this.values.mothershipX = mothershipX;
    }

    get mothershipY() {
        return this.values.mothershipY;
    }
    set mothershipY(mothershipY) {
        if (mothershipY == this.values.mothershipY) return;
        
        this.state.mothershipY |= 1;
        this.entity.state |= 1;
        this.values.mothershipY = mothershipY;
    }

    get mothership() {
        return this.values.mothership;
    }
    set mothership(mothership) {
        if (mothership == this.values.mothership) return;
        
        this.state.mothership |= 1;
        this.entity.state |= 1;
        this.values.mothership = mothership;
    }
}
