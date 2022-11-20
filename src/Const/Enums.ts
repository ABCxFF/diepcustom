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
 * The IDs for all the team colors, by name.
 */
export enum Colors {
    Border,
    Barrel,
    Tank,
    TeamBlue,
    TeamRed,
    TeamPurple,
    TeamGreen,
    Shiny,
    EnemySquare,
    EnemyTriangle,
    EnemyPentagon,
    EnemyCrasher,
    Neutral,
    ScoreboardBar,
    Box,
    EnemyTank,
    NecromancerSquare,
    Fallen,

    kMaxColors
}

/**
 * The hex color codes of each color (by ID), expressed as an int (0x00RRGGBB)
 */
export const ColorsHexCode: Record<Colors, number> = {
    [Colors.Border]: 0x555555,
    [Colors.Barrel]: 0x999999,
    [Colors.Tank]: 0x00B2E1,
    [Colors.TeamBlue]: 0x00B2E1,
    [Colors.TeamRed]: 0xF14E54,
    [Colors.TeamPurple]: 0xBF7FF5,
    [Colors.TeamGreen]: 0x00E16E,
    [Colors.Shiny]: 0x8AFF69,
    [Colors.EnemySquare]: 0xFFE869,
    [Colors.EnemyTriangle]: 0xFC7677,
    [Colors.EnemyPentagon]: 0x768DFC,
    [Colors.EnemyCrasher]: 0xF177DD,
    [Colors.Neutral]: 0xFFE869,
    [Colors.ScoreboardBar]: 0x43FF91,
    [Colors.Box]: 0xBBBBBB,
    [Colors.EnemyTank]: 0xF14E54,
    [Colors.NecromancerSquare]: 0xFCC376,
    [Colors.Fallen]: 0xC0C0C0,
    [Colors.kMaxColors]: 0x000000
}

/**
 * The IDs for all the tanks, by name.
 */
export enum Tank {
    Basic         = 0,
    Twin          = 1,
    Triplet       = 2,
    TripleShot    = 3,
    QuadTank      = 4,
    OctoTank      = 5,
    Sniper        = 6,
    MachineGun    = 7,
    FlankGuard    = 8,
    TriAngle      = 9,
    Destroyer     = 10,
    Overseer      = 11,
    Overlord      = 12,
    TwinFlank     = 13,
    PentaShot     = 14,
    Assassin      = 15,
    ArenaCloser   = 16,
    Necromancer   = 17,
    TripleTwin    = 18,
    Hunter        = 19,
    Gunner        = 20,
    Stalker       = 21,
    Ranger        = 22,
    Booster       = 23,
    Fighter       = 24,
    Hybrid        = 25,
    Manager       = 26,
    Mothership    = 27,
    Predator      = 28,
    Sprayer       = 29,
    Trapper       = 30,
    GunnerTrapper = 32,
    Overtrapper   = 33,
    MegaTrapper   = 34,
    TriTrapper    = 35,
    Smasher       = 36,
    Landmine      = 37,
    AutoGunner    = 39,
    Auto5         = 40,
    Auto3         = 41,
    SpreadShot    = 42,
    Streamliner   = 43,
    AutoTrapper   = 44,
    DominatorD    = 45,
    DominatorG    = 46,
    DominatorT    = 47,
    Battleship    = 48,
    Annihilator   = 49,
    AutoSmasher   = 50,
    Spike         = 51,
    Factory       = 52,
    Skimmer       = 54,
    Rocketeer     = 55
}

/**
 * The IDs for all the stats, by name.
 */
export enum Stat {
    MovementSpeed = 0,
    Reload = 1,
    BulletDamage = 2,
    BulletPenetration = 3,
    BulletSpeed = 4,
    BodyDamage = 5,
    MaxHealth = 6,
    HealthRegen = 7
}
/**
 * Total Stat Count
 */
export const StatCount = 8;

/**
 * IDs for the groupings of fields in diep protocol.
 * For more details read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
export enum FieldGroups {
    Relations   = 0,
    Barrel      = 2,
    Physics     = 3,
    Health      = 4,
    Unused      = 6,
    Arena       = 7,
    Name        = 8,
    Camera      = 9,
    Position    = 10,
    Style       = 11,
    Score       = 13,
    Team        = 14
}
/**
 * Packet headers for the [serverbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md).
 */
export enum ServerBound {
    Init            = 0x0,
    Input           = 0x1,
    Spawn           = 0x2,
    StatUpgrade     = 0x3,
    TankUpgrade     = 0x4,
    Ping            = 0x5,
    TCPInit         = 0x6,
    ExtensionFound  = 0x7,
    ToRespawn       = 0x8,
    TakeTank        = 0x9
}
/**
 * Packet headers for the [clientbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/clientbound.md).
 */
export enum ClientBound {
    Update          = 0x0,
    OutdatedClient  = 0x1,
    Compressed      = 0x2,
    Notification    = 0x3,
    ServerInfo      = 0x4,
    Ping            = 0x5,
    PartyCode       = 0x6,
    Accept          = 0x7,
    Achievement     = 0x8,
    InvalidParty    = 0x9,
    PlayerCount     = 0xA,
    ProofOfWork     = 0xB
}

/**
 * Flags sent within the [input packet](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md#0x01-input-packet).
 */
export enum InputFlags {
    leftclick   = 1 << 0,
    up          = 1 << 1,
    left        = 1 << 2,
    down        = 1 << 3,
    right       = 1 << 4,
    godmode     = 1 << 5,
    suicide     = 1 << 6,
    rightclick  = 1 << 7,
    levelup     = 1 << 8,
    gamepad     = 1 << 9,
    switchtank  = 1 << 10,
    adblock     = 1 << 11
}

/**
 * The flag names for the `GUI` field of the arena field group.
 */
export enum GUIFlags {
    noJoining       = 1 << 0,
    showLeaderArrow = 1 << 1,
    hideScorebar    = 1 << 2,
    gameReadyStart  = 1 << 3,
    canUseCheats    = 1 << 4
}
/**
 * The flag names for the `mothership` field of the team field group.
 */
export enum MothershipFlags {
    hasMothership = 1 << 0
}
/**
 * The flag names for the `camera` field of the camera field group.
 */
export enum CameraFlags {
    useCameraCoords     = 1 << 0,
    showDeathStats      = 1 << 1,
    gameWaitingStart    = 1 << 2
}
/**
 * The flag names for the `styleFlags` field of the syle field group.
 */
export enum StyleFlags {
    visible         = 1 << 0,
    damage          = 1 << 1,
    invincibility   = 1 << 2,
    minimap2        = 1 << 3,
    star            = 1 << 4,
    trap            = 1 << 5,
    aboveParent     = 1 << 6,
    noDmgIndicator  = 1 << 7
}
/**
 * The flag names for the `motion` field of the position field group.
 */
export enum MotionFlags {
    absoluteRotation    = 1 << 0,
    canMoveThroughWalls = 1 << 1
}
/**
 * The flag names for the `objectFlags` field of the physics field group.
 */
export enum ObjectFlags {
    isTrapezoid             = 1 << 0,
    minimap                 = 1 << 1,
    unknown1                = 1 << 2,
    noOwnTeamCollision      = 1 << 3,
    wall                    = 1 << 4,
    onlySameOwnerCollision  = 1 << 5,
    base                    = 1 << 6,
    unknown4                = 1 << 7,
    canEscapeArena          = 1 << 8
}
/**
 * The flag names for the `shooting` field of the barrel field group.
 */
export enum ShootingFlags {
    shoot = 1 << 0
}
/**
 * The flag names for the `healthbar` field of the health field group.
 */
export enum HealthbarFlags {
    hidden = 1 << 0
}
/**
 * The flag names for the `nametag` field of the name field group.
 */
export enum NametagFlags {
    hidden = 1 << 0,
    cheats = 1 << 1
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * `[index: level]->score at level`
 */
export const levelToScoreTable = Array(45).fill(0);

for (let i = 1; i < 45; ++i) {
    levelToScoreTable[i] = levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * Used for level calculation across the codebase.
 * 
 * `(level)->score at level`
 */
export function levelToScore(level: number): number {
    if (level >= 45) return levelToScoreTable[44];
    if (level <= 0) return 0;

    return levelToScoreTable[level - 1];
}
