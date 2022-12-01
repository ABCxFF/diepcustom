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

const FIELD_ORDER = "y,x,angle,size,player,GUI,color,scoreboardColors,killedBy,playersNeeded,sides,mothership,healthbar,scoreboardTanks,respawnLevel,levelbarProgress,spawnTick,absorbtionFactor,leaderX,maxHealth,styleFlags,unknown,trapezoidalDir,motion,scoreboardNames,scorebar,mothershipY,scoreboardSuffixes,nametag,movementSpeed,leaderY,bottomY,team,level,teamColor,FOV,statLimits,leftX,scoreboardScores,statLevels,tankOverride,tank,borderThickness,deathTick,width,statsAvailable,shooting,levelbarMax,name,owner,health,cameraY,opacity,reloadTime,statNames,cameraX,mothershipX,unusedClientId,parent,zIndex,camera,rightX,pushFactor,objectFlags,scoreboardAmount,ticksUntilStart,topY,score".split(',');

const FIELD_GROUPS = [
    [
        "Relations",
        [
            {
                "name": "parent",
                "encType": "entid"
            },
            {
                "name": "owner",
                "encType": "entid"
            },
            {
                "name": "team",
                "encType": "entid"
            }
        ]
    ],
    null, // CPUControllable
    [
        "Barrel",
        [
            {
                "name": "shooting",
                "encType": "vu"
            },
            {
                "name": "reloadTime",
                "encType": "float"
            },
            {
                "name": "shootingAngle",
                "encType": "float"
            }
        ]
    ],
    [
        "Physics",
        [
            {
                "name": "object",
                "encType": "vu"
            },
            {
                "name": "sides",
                "encType": "vu"
            },
            {
                "name": "size",
                "encType": "float"
            },
            {
                "name": "width",
                "encType": "float"
            },
            {
                "name": "knockbackMultiplier",
                "encType": "float"
            },
            {
                "name": "knockbackOnTick",
                "encType": "float"
            }
        ]
    ],
    [
        "Health",
        [
            {
                "name": "healthbar",
                "encType": "vu"
            },
            {
                "name": "health",
                "encType": "float"
            },
            {
                "name": "maxHealth",
                "encType": "float"
            }
        ]
    ],
    null, // Dominator
    [ // ExampleComponent
        "Unused",
        [
            {
                "name": "exampleTest",
                "encType": "vi"
            }
        ]
    ],
    // [
    //     "Lobby",
    //     [
    //         {
    //             "name": "playerCount",
    //             "encType": "vu"
    //         },
    //         {
    //             "name": "playerIds",
    //             "encType": "stringNT",
    //             "amount": 80
    //         },
    //         {
    //             "name": "playerNames",
    //             "encType": "stringNT",
    //             "amount": 80
    //         }
    //     ]
    // ],
    [
        "Arena",
        [
            {
                "name": "GUI",
                "encType": "vu"
            },
            {
                "name": "arenaLeftX",
                "encType": "float"
            },
            {
                "name": "arenaTopY",
                "encType": "float"
            },
            {
                "name": "arenaRightX",
                "encType": "float"
            },
            {
                "name": "arenaBottomY",
                "encType": "float"
            },
            {
                "name": "scoreboardAmount",
                "encType": "vu"
            },
            {
                "name": "scoreboardNames",
                "encType": "stringNT",
                "amount": 10
            },
            {
                "name": "scoreboardScores",
                "encType": "float",
                "amount": 10
            },
            {
                "name": "scoreboardColors",
                "encType": "vu",
                "amount": 10
            },
            {
                "name": "scoreboardSuffixes",
                "encType": "stringNT",
                "amount": 10
            },
            {
                "name": "scoreboardTanks",
                "encType": "tank",
                "amount": 10
            },
            {
                "name": "leaderX",
                "encType": "float"
            },
            {
                "name": "leaderY",
                "encType": "float"
            },
            {
                "name": "playersNeeded",
                "encType": "vi"
            },
            {
                "name": "ticksUntilStart",
                "encType": "float"
            }
        ]
    ],
    [
        "Name",
        [
            {
                "name": "nametag",
                "encType": "vu"
            },
            {
                "name": "name",
                "encType": "stringNT"
            }
        ]
    ],
    [
        "Camera",
        [
            {
                "name": "clientID",
                "encType": "vu"
            },
            {
                "name": "camera",
                "encType": "vu"
            },
            {
                "name": "player",
                "encType": "entid"
            },
            {
                "name": "FOV",
                "encType": "float"
            },
            {
                "name": "level",
                "encType": "vi"
            },
            {
                "name": "tank",
                "encType": "tank"
            },
            {
                "name": "levelbarProgress",
                "encType": "float"
            },
            {
                "name": "levelbarMax",
                "encType": "float"
            },
            {
                "name": "statsAvailable",
                "encType": "vi"
            },
            {
                "name": "statNames",
                "encType": "stringNT",
                "amount": 8
            },
            {
                "name": "statLevels",
                "encType": "vi",
                "amount": 8
            },
            {
                "name": "statMaxes",
                "encType": "vi",
                "amount": 8
            },
            {
                "name": "cameraX",
                "encType": "float"
            },
            {
                "name": "cameraY",
                "encType": "float"
            },
            {
                "name": "scorebar",
                "encType": "float"
            },
            {
                "name": "respawnLevel",
                "encType": "vi"
            },
            {
                "name": "killedBy",
                "encType": "stringNT"
            },
            // {
            //     "name": "spectatorID",
            //     "encType": "stringNT"
            // },
            {
                "name": "spawnTick",
                "encType": "vi"
            },
            {
                "name": "deathTick",
                "encType": "vi"
            },
            {
                "name": "tankOverride",
                "encType": "stringNT"
            },
            {
                "name": "movementSpeed",
                "encType": "float"
            }
        ]
    ],
    [
        "Position",
        [
            {
                "name": "x",
                "encType": "vi"
            },
            {
                "name": "y",
                "encType": "vi"
            },
            {
                "name": "angle",
                "encType": "float64Precision"
            },
            {
                "name": "motion",
                "encType": "vu"
            }
        ]
    ],
    [
        "Style",
        [
            {
                "name": "style",
                "encType": "vu"
            },
            {
                "name": "color",
                "encType": "vu"
            },
            {
                "name": "borderThickness",
                "encType": "float64Precision"
            },
            {
                "name": "opacity",
                "encType": "float"
            },
            {
                "name": "globalZIndex",
                "encType": "vu"
            }
        ]
    ],
    null, // Tagged
    [
        "Score",
        [
            {
                "name": "score",
                "encType": "float"
            }
        ]
    ],
    [
        "Team",
        [
            {
                "name": "teamColor",
                "encType": "vu"
            },
            {
                "name": "mothershipX",
                "encType": "float"
            },
            {
                "name": "mothershipY",
                "encType": "float"
            },
            {
                "name": "mothership",
                "encType": "vu"
            }
        ]
    ]
];