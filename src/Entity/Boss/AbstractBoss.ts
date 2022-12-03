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

import { ClientBound, Color, PositionFlags } from "../../Const/Enums";
import { VectorAbstract } from "../../Physics/Vector";
import { AI, AIState, Inputs } from "../AI";
import { NameGroup } from "../../Native/FieldGroups";
import LivingEntity from "../Live";
import TankBody from "../Tank/TankBody";


/**
 * Possible targets for movement
 */
enum Target {
    None = -1,
    BottomRight = 0,
    TopRight = 1,
    TopLeft = 2,
    BottomLeft = 3
}

class BossMovementControl {
    /** Current target on the map. */
    public target: Target = Target.None;

    /** The boss thats movement is being controlled. */
    public boss: AbstractBoss;

    public constructor(boss: AbstractBoss) {
        this.boss = boss;
    }
    
    public moveBoss() {
        const { x, y } = this.boss.positionData.values;
        if (this.target === Target.None) {
            if (x >= 0 && y >= 0) {
                this.target = Target.BottomRight;
            } else if (x <= 0 && y >= 0) {
                this.target = Target.BottomLeft;
            } else if (x <= 0 && y <= 0) {
                this.target = Target.TopLeft;
            }else /*if (x >= 0 && y <= 0)*/ {
                this.target = Target.TopRight;
            }
        }

        const target: VectorAbstract = this.target === Target.BottomRight ?
            { x: 3 * this.boss.game.arena.arenaData.values.rightX / 4, y: 3 * this.boss.game.arena.arenaData.values.bottomY / 4} : this.target === Target.BottomLeft ?
            { x: 3 * this.boss.game.arena.arenaData.values.leftX / 4, y: 3 * this.boss.game.arena.arenaData.values.bottomY / 4} : this.target === Target.TopLeft ? 
            { x: 3 * this.boss.game.arena.arenaData.values.leftX / 4, y: 3 * this.boss.game.arena.arenaData.values.topY / 4} :
            { x: 3 * this.boss.game.arena.arenaData.values.rightX / 4, y: 3 * this.boss.game.arena.arenaData.values.topY  / 4};

        // Target becomes delta now
        target.x = (target.x - x);
        target.y = (target.y - y);
        const dist = target.x ** 2 + target.y ** 2;
        if (dist < 90_000 /* 300 ** 2*/) this.target = (this.target + 1) % 4;
        else {
            const angle = Math.atan2(target.y, target.x)
            this.boss.inputs.movement.x = Math.cos(angle);
            this.boss.inputs.movement.y = Math.sin(angle);
        }
    }
}

/**
 * Class which represents all the bosses.
 */
export default class AbstractBoss extends LivingEntity {
    /** Always existant name field group, present in all bosses. */
    public nameData: NameGroup = new NameGroup(this);
    /** Alternate name, eg Guardian and Guardian of the Pentagons to appear in notifications" */
    public altName: string | null = null;

    /** The active change in size from the base size to the current. Contributes to barrel and addon sizes. */
    public sizeFactor = 1;
    /** The reload time calculation property. Used for calculating reload of barrels. */
    public reloadTime = 15;

    /** The AI that controls how this boss moves. */
    public ai: AI;
    /** The AI's inputs (for fullfilling BarrelBase typedef). */
    public inputs: Inputs;

    /** The boss's "camera entity" */
    public cameraEntity = this;

    /** Whether or not the broadcast message was sent "The ___ has spawned!" */
    private hasBeenWelcomed = false;

    /** List of the boss barrels. */
    protected barrels: Barrel[] = [];
    /** The speed to maintain during movement. */
    public movementSpeed = 0.5;

    /** The thing that controls map wide movement. */
    protected movementControl = new BossMovementControl(this)

    public constructor(game: GameServer) {
        super(game);

        const {x, y} = this.game.arena.findSpawnLocation()
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        
        this.relationsData.values.team = this.cameraEntity;

        this.physicsData.values.absorbtionFactor = 0.05;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.scoreReward = 30000 * this.game.arena.shapeScoreRewardMultiplier;
        this.damagePerTick = 60;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.ai['_findTargetInterval'] = 0;
        this.inputs = this.ai.inputs;

        // default ehColor
        this.styleData.values.color = Color.Fallen;

        this.physicsData.values.sides = 1;
        this.physicsData.values.size = 50 * Math.pow(1.01, 75 - 1);

        this.reloadTime = 15 * Math.pow(0.914, 7);

        this.sizeFactor = this.physicsData.values.size / 50;
        this.healthData.values.health = this.healthData.values.maxHealth = 3000;
    }

    // For map wide movement
    protected moveAroundMap() {
        this.movementControl.moveBoss();
    }

    /** See LivingEntity.onDeath
     * This broadcasts when people kill it
     * Will set game.arena.boss to null, so that the next boss can spawn
     */
    public onDeath(killer: LivingEntity) {
        // Reset arena.boss
        if (this.game.arena.boss === this) this.game.arena.boss = null;

        const killerName = (killer instanceof TankBody && killer.nameData.values.name) || "an unnamed tank"
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT(`The ${this.altName || this.nameData.values.name} has been defeated by ${killerName}!`)
            .u32(0x000000)
            .float(10000)
            .stringNT("").send();
    }

    public tick(tick: number) {
        // Force
        if (this.inputs !== this.ai.inputs) this.inputs = this.ai.inputs;

        this.ai.movementSpeed = this.movementSpeed;
        
        if (this.ai.state !== AIState.possessed) this.moveAroundMap();
        else {
            const x = this.positionData.values.x,
                  y = this.positionData.values.y;

            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
        this.accel.add({
            x: this.inputs.movement.x * this.movementSpeed,
            y: this.inputs.movement.y * this.movementSpeed,
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });

        this.regenPerTick = this.healthData.values.maxHealth / 25000;

        // So the name can be set in an extended constructor
        if (!this.hasBeenWelcomed) {
            let message = "An unnamed boss has spawned!"
            if (this.nameData.values.name) {
                message = `The ${this.altName || this.nameData.values.name} has spawned!`;
            }
            this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(0x000000).float(10000).stringNT("").send();
            this.hasBeenWelcomed = true;
        }

        super.tick(tick);
    }
}
