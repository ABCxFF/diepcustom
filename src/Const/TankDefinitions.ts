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

import DevTankDefinitions, { DevTank } from "./DevTankDefinitions";
import { Tank, Colors } from "./Enums";

/** The types of post addons that exist in the game, by their id. */
export type postAddonId = "dompronounced" | "auto5" | "auto3" | "autosmasher" | "spike" | "pronounced" | "smasher" | "landmine" | "autoturret" | "weirdspike" | "auto2" | "auto7" | "autorocket" | "spiesk"

/** The types of post addons that exist in the game, by their id. */
export type preAddonId = "dombase" | "launcher"
/** A joint list of all post addon ids and pre addon ids. */
export type addonId = preAddonId | postAddonId;

/** The types of projectiles in the game */
export type projectileId = "bullet" | "drone" | "trap" | "necrodrone" | "minion" | "skimmer" | "rocket" | "swarm" | "flame" | "wall" | "croc";

/** The types of barrel addons that exist in the game */
export type barrelAddonId = "trapLauncher";

/** Increase in opacity when taking damage. */
export const visibilityRateDamage = 0.2;

/**
 * Format that the game stores bullet definitions in its memory.
 */
export interface BulletDefinition {
    /** The type of the bullet that the barrel shoots. */
    type: projectileId;
    /** Size of the bullet shot out of the barrel in relation to the barrel's size. */
    sizeRatio: number;
    /** Used to calculate the health of the bullet that the barrel shoots. */
    health: number;
    /** Used to calculate the damage of the bullet that the barrel shoots. */
    damage: number;
    /** Used to calculate the speed of the bullet that the barrel shoots. */
    speed: number;
    /** Used to calculate the scattering rate / spread of the bullets. */
    scatterRate: number;
    /** Used to calculate the life length of a bullet that the barrel shoots. */
    lifeLength: number;
    /** Knockback factor field of the bullet */
    absorbtionFactor: number;
    /** Projectile color - by default this is set to parent's body color. */
    color?: Colors;
    /** Overrides number of sides for projectile. */
    sides?: number;
}

/**
 * Format that the game stores barrel definitions in its memory.
 */
export interface BarrelDefinition {
    /** The angle that the barrel is rotated towards, from the tank's body.  */
    angle: number;
    /** The x offset of the barrel (think of Twin's barrels for example) at base radius (50).  */
    offset: number;
    /** The size of the barrel. Think of Sniper, the longer side is the size.  */
    size: number;
    /** The width of the barrel. Think of Sniper, the shorter side is the width. Width is used to determine bullet size */
    width: number;
    /** Delay between firing cycle. Think of Octo: half of the barrels have 0 delay, and the other half have 0.5 delay.  */
    delay: number;
    /** Used to calculate the reload of a barrel. */
    reload: number;
    /** Used to calculate the recoil of a barrel's shot. */
    recoil: number;
    /** Example: Machine Gun's barrel is a trapezoid. */
    isTrapezoid: boolean;
    /** Direction that the trapezoid is facing. Machine Gun's `trapezoidalDirection` is `0`, and Stalker's is `π`. */
    trapezoidDirection: number;
    /** Barrel addon. As of now only the trapper addon exists. */
    addon: barrelAddonId | null;
    /** The maximum numbers of drones the barrel can spawn - only present if `bullet.type` === 'drone'. */
    droneCount?: number;
    /** Whether or not the drones are controllable - only present if `bullet.type` === 'drone'. */
    canControlDrones?: boolean;
    /** Whether or not the barrel should always shoot (Trapper Dominator, Defender). */
    forceFire?: boolean;
    /** The definition of the bullet that is shot from the barrel. */
    bullet: BulletDefinition;
}
/**
 * Format that the game stores stat definitions in its memory.
 */
export interface StatDefinition {
    /** The name of the stat. */
    name: string;
    /** The stat level limit. */
    max: number;
}
/**
 * Format that the game stores tank definitions in its memory.
 */
export interface TankDefinition {
    /** The id of the tank. */
    id: Tank | DevTank;
    /** The name of the tank. */
    name: string;
    /** If not empty, the client is sent a notification with this message when it upgrades to this tank. */
    upgradeMessage: string;
    /** The levels required to upgrade to this tank. */
    levelRequirement: number;
    /** The tanks this tank can upgrade to. */
    upgrades: (Tank | DevTank)[];
    /** Boolean flags about the tank. */
    flags: {
        /** If the tank can go invisible. */
        invisibility: boolean;
        /** If the tank has a Predator-like zoom ability */
        zoomAbility: boolean;
        /** If the tank can claim squares by killing them (necro) */
        canClaimSquares?: boolean;
        /** If the tank requires devmode to access (unused). */
        devOnly: boolean;
    },
    /** How much the opacity increases per tick while shooting */
    visibilityRateShooting: number;
    /** How much the opacity increases per tick while moving */
    visibilityRateMoving: number;
    /** How much does the opacity decrease per tick */
    invisibilityRate: number;
    /** Used to determine the FOV of a tank. */
    fieldFactor: number;
    /** The speed of the tank */
    speed: number;
    /** The absorbtionFactor (field) of the tank */
    absorbtionFactor: number;
    /** The base max health of the tank */
    maxHealth: number;
    /** The addon, if not empty, which is built before the barrels. */
    preAddon: addonId | null;
    /** The addon, if not empty, which is built after the barrels. */
    postAddon: addonId | null;
    /** The sides of the tank's body. */
    sides: number;
    /** The border width of the tank's body. */
    borderWidth: number;
    /** The tank's barrels. */
    barrels: BarrelDefinition[];
    /** The tank's stat names and limits. */
    stats: StatDefinition[];
}

/**
 * List of all tank definitions.
 */
const TankDefinitions = JSON.parse(`[
    {
        "id": 0,
        "name": "Tank",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [
            1,
            6,
            7,
            8,
            36
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 1,
        "name": "Twin",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [
            3,
            4,
            13
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 2,
        "name": "Triplet",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 3,
        "name": "Triple Shot",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            2,
            14,
            42
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 4,
        "name": "Quad Tank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            5,
            40
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 5,
        "name": "Octo Tank",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.356194490192345,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 6,
        "name": "Sniper",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [
            15,
            11,
            19,
            31
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 7,
        "name": "Machine Gun",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [
            10,
            20,
            29
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 8,
        "name": "Flank Guard",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [
            9,
            4,
            13,
            41
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 9,
        "name": "Tri-Angle",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            23,
            24
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 10,
        "name": "Destroyer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            25,
            49,
            54,
            55
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 11,
        "name": "Overseer",
        "upgradeMessage": "Use your left mouse button to control the drones",
        "levelRequirement": 30,
        "upgrades": [
            12,
            17,
            26,
            33,
            48,
            52
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 12,
        "name": "Overlord",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 13,
        "name": "Twin Flank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            18,
            48
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 14,
        "name": "Penta Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 15,
        "name": "Assassin",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            22,
            21
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 16,
        "name": "Arena Closer",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 300,
                    "damage": 7,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 17,
        "name": "Necromancer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 18,
        "name": "Triple Twin",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 19,
        "name": "Hunter",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            28,
            43
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 20,
        "name": "Gunner",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            39,
            32,
            43
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -32,
                "size": 65,
                "width": 25.2,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 32,
                "size": 65,
                "width": 25.2,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 85,
                "width": 25.2,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 85,
                "width": 25.2,
                "delay": 0.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 21,
        "name": "Stalker",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 22,
        "name": "Ranger",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.7,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 23,
        "name": "Booster",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.9269908169872414,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 24,
        "name": "Fighter",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 25,
        "name": "Hybrid",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.4,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 26,
        "name": "Manager",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 8,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 27,
        "name": "Mothership",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 0.01,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 16,
        "borderWidth": 140,
        "barrels": [
            {
                "angle": 0.19634954084936207,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.5890486225480862,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.9817477042468103,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.3744467859455345,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.7671458676442586,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.159844949342983,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.552544031041707,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.9452431127404313,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.3379421944391554,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.7306412761378795,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.12333992150429,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.516039439535327,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.908738521234052,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 5.301437166600463,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 5.6941366846315,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 6.086835766330224,
                "offset": 0,
                "size": 60,
                "width": 10.5,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.48,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 28,
        "name": "Predator",
        "upgradeMessage": "Use your right mouse button to look further in the direction you're facing",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": true,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 71.39999999999999,
                "delay": 0.4,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 29,
        "name": "Sprayer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    null,
    {
        "id": 31,
        "name": "Trapper",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            35,
            32,
            33,
            34,
            44
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 32,
        "name": "Gunner Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -16,
                "size": 75,
                "width": 21,
                "delay": 0.66,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 16,
                "size": 75,
                "width": 21,
                "delay": 0.33,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 33,
        "name": "Overtrapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.4,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.1887902047863905,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.4,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 34,
        "name": "Mega Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3.3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 1.28,
                    "health": 3.2,
                    "damage": 1.6,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 35,
        "name": "Tri-Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.1887902047863905,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 36,
        "name": "Smasher",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            38,
            50,
            51
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "smasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    null,
    {
        "id": 38,
        "name": "Landmine",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0,
        "visibilityRateMoving": 0.16,
        "invisibilityRate": 0.003,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "landmine",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 39,
        "name": "Auto Gunner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -32,
                "size": 65,
                "width": 25.2,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 32,
                "size": 65,
                "width": 25.2,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 85,
                "width": 25.2,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 85,
                "width": 25.2,
                "delay": 0.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 40,
        "name": "Auto 5",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto5",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 41,
        "name": "Auto 3",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            40,
            39
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 42,
        "name": "Spread Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.3089969389957472,
                "offset": 0,
                "size": 65,
                "width": 29.4,
                "delay": 0.833325,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.3089969389957472,
                "offset": 0,
                "size": 65,
                "width": 29.4,
                "delay": 0.833325,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.666675,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.666675,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 77,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 77,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.5235987755982988,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.333325,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.5235987755982988,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.333325,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.2617993877991494,
                "offset": 0,
                "size": 89,
                "width": 29.4,
                "delay": 0.166675,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.2617993877991494,
                "offset": 0,
                "size": 89,
                "width": 29.4,
                "delay": 0.166675,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 43,
        "name": "Streamliner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.1,
                    "scatterRate": 0.3,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0.2,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.1,
                    "scatterRate": 0.3,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.4,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.1,
                    "scatterRate": 0.3,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.6,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.1,
                    "scatterRate": 0.3,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.8,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.1,
                    "scatterRate": 0.3,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 44,
        "name": "Auto Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 45,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": "dompronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 34.99965,
                "delay": 0.001,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 100,
                    "damage": 10,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 46,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": "dompronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -6,
                "size": 75,
                "width": 17.50035,
                "delay": 0.666,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 6,
                "size": 75,
                "width": 17.50035,
                "delay": 0.333,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 17.50035,
                "delay": 0.001,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 47,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.9269908169872414,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 5.497787143782138,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 48,
        "name": "Battleship",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.5707963267948966,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 49,
        "name": "Annihilator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 96.6,
                "delay": 0,
                "reload": 4,
                "recoil": 17,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.05
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 50,
        "name": "Auto Smasher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autosmasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 51,
        "name": "Spike",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "spike",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 52,
        "name": "Factory",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 6,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 4,
                    "damage": 0.7,
                    "speed": 0.56,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 53,
        "name": "",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 54,
        "name": "Skimmer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launcher",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "skimmer",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 1.3,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 55,
        "name": "Rocketeer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launcher",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "rocket",
                    "sizeRatio": 1,
                    "health": 5,
                    "damage": 1,
                    "speed": 0.3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    }
]`) as (TankDefinition | null)[] & Record<Tank, TankDefinition>;

export default TankDefinitions;

/**
 * The count of all existing tanks (some in tank definitions are null).
 * Used for tank xor generation.
 */
export const TankCount = TankDefinitions.reduce((a, b) => b ? a + 1 : a, 0);

/**
 * A function used to retrieve both tank and dev tank definitions from their id.
 * Negative IDs are used to index dev tanks, whereas positive are used to index normal tanks. 
 */
export const getTankById = function (id: number): TankDefinition | null {
    return (id < 0 ? DevTankDefinitions[~id] : TankDefinitions[id]) || null;
}

export const getTankByName = function (tankName: string): TankDefinition | null {
    return TankDefinitions.find(tank => tank && tank.name === tankName) || DevTankDefinitions.find(tank => tank && tank.name === tankName) || null;
}
