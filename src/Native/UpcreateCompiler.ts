// @ts-nocheck

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

import Writer from "../Coder/Writer";
import { Entity } from "./Entity";

/** Entity creation compiler function... Run! */
export const compileCreation = (w: Writer, entity: Entity) => {
    w.entid(entity).u8(1);


 /* <template> auto-generated */ 
    const hasRelations = !!entity.relationsData;
    const hasBarrel = !!entity.barrelData;
    const hasPhysics = !!entity.physicsData;
    const hasHealth = !!entity.healthData;
    const hasArena = !!entity.arenaData;
    const hasName = !!entity.nameData;
    const hasCamera = !!entity.cameraData;
    const hasPosition = !!entity.positionData;
    const hasStyle = !!entity.styleData;
    const hasScore = !!entity.scoreData;
    const hasTeam = !!entity.teamData;

    // Field group def
    let at = -1;
 /* <template> auto-generated */ 
    if (hasRelations) { w.u8((0 - at) ^ 1); at = 0; };
    if (hasBarrel) { w.u8((2 - at) ^ 1); at = 2; };
    if (hasPhysics) { w.u8((3 - at) ^ 1); at = 3; };
    if (hasHealth) { w.u8((4 - at) ^ 1); at = 4; };
    if (hasArena) { w.u8((7 - at) ^ 1); at = 7; };
    if (hasName) { w.u8((8 - at) ^ 1); at = 8; };
    if (hasCamera) { w.u8((9 - at) ^ 1); at = 9; };
    if (hasPosition) { w.u8((10 - at) ^ 1); at = 10; };
    if (hasStyle) { w.u8((11 - at) ^ 1); at = 11; };
    if (hasScore) { w.u8((13 - at) ^ 1); at = 13; };
    if (hasTeam) { w.u8((14 - at) ^ 1); at = 14; };
    w.u8(1); // close table

 /* <template> auto-generated */ 
    if (hasPosition) w.vi(entity.positionData.values.y);
    if (hasPosition) w.vi(entity.positionData.values.x);
    if (hasPosition) w.float64Precision(entity.positionData.values.angle);
    if (hasPhysics) w.float(entity.physicsData.values.size);
    if (hasCamera) w.entid(entity.cameraData.values.player);
    if (hasArena) w.vu(entity.arenaData.values.flags);
    if (hasStyle) w.vu(entity.styleData.values.color);
    if (hasArena) for (at = 0; at < 10; ++at) w.vu(entity.arenaData.values.scoreboardColors.values[at]);
    if (hasCamera) w.stringNT(entity.cameraData.values.killedBy);
    if (hasArena) w.vi(entity.arenaData.values.playersNeeded);
    if (hasPhysics) w.vu(entity.physicsData.values.sides);
    if (hasTeam) w.vu(entity.teamData.values.flags);
    if (hasHealth) w.vu(entity.healthData.values.flags);
    if (hasArena) for (at = 0; at < 10; ++at) w.vi(entity.arenaData.values.scoreboardTanks.values[at]);
    if (hasCamera) w.vi(entity.cameraData.values.respawnLevel);
    if (hasCamera) w.float(entity.cameraData.values.levelbarProgress);
    if (hasCamera) w.vi(entity.cameraData.values.spawnTick);
    if (hasPhysics) w.float(entity.physicsData.values.absorbtionFactor);
    if (hasArena) w.float(entity.arenaData.values.leaderX);
    if (hasHealth) w.float(entity.healthData.values.maxHealth);
    if (hasStyle) w.vu(entity.styleData.values.flags);
    if (hasBarrel) w.float(entity.barrelData.values.trapezoidDirection);
    if (hasPosition) w.vu(entity.positionData.values.flags);
    if (hasArena) for (at = 0; at < 10; ++at) w.stringNT(entity.arenaData.values.scoreboardNames.values[at]);
    if (hasCamera) w.float(entity.cameraData.values.score);
    if (hasTeam) w.float(entity.teamData.values.mothershipY);
    if (hasArena) for (at = 0; at < 10; ++at) w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[at]);
    if (hasName) w.vu(entity.nameData.values.flags);
    if (hasCamera) w.float(entity.cameraData.values.movementSpeed);
    if (hasArena) w.float(entity.arenaData.values.leaderY);
    if (hasArena) w.float(entity.arenaData.values.bottomY);
    if (hasRelations) w.entid(entity.relationsData.values.team);
    if (hasCamera) w.vi(entity.cameraData.values.level);
    if (hasTeam) w.vu(entity.teamData.values.teamColor);
    if (hasCamera) w.float(entity.cameraData.values.FOV);
    if (hasCamera) for (at = 0; at < 8; ++at) w.vi(entity.cameraData.values.statLimits.values[at]);
    if (hasArena) w.float(entity.arenaData.values.leftX);
    if (hasArena) for (at = 0; at < 10; ++at) w.float(entity.arenaData.values.scoreboardScores.values[at]);
    if (hasCamera) for (at = 0; at < 8; ++at) w.vi(entity.cameraData.values.statLevels.values[at]);
    if (hasCamera) w.stringNT(entity.cameraData.values.tankOverride);
    if (hasCamera) w.vi(entity.cameraData.values.tank);
    if (hasStyle) w.float64Precision(entity.styleData.values.borderWidth);
    if (hasCamera) w.vi(entity.cameraData.values.deathTick);
    if (hasPhysics) w.float(entity.physicsData.values.width);
    if (hasCamera) w.vi(entity.cameraData.values.statsAvailable);
    if (hasBarrel) w.vu(entity.barrelData.values.flags);
    if (hasCamera) w.float(entity.cameraData.values.levelbarMax);
    if (hasName) w.stringNT(entity.nameData.values.name);
    if (hasRelations) w.entid(entity.relationsData.values.owner);
    if (hasHealth) w.float(entity.healthData.values.health);
    if (hasCamera) w.float(entity.cameraData.values.cameraY);
    if (hasStyle) w.float(entity.styleData.values.opacity);
    if (hasBarrel) w.float(entity.barrelData.values.reloadTime);
    if (hasCamera) for (at = 0; at < 8; ++at) w.stringNT(entity.cameraData.values.statNames.values[at]);
    if (hasCamera) w.float(entity.cameraData.values.cameraX);
    if (hasTeam) w.float(entity.teamData.values.mothershipX);
    if (hasCamera) w.vu(entity.cameraData.values.unusedClientId);
    if (hasRelations) w.entid(entity.relationsData.values.parent);
    if (hasStyle) w.vu(entity.styleData.values.zIndex);
    if (hasCamera) w.vu(entity.cameraData.values.flags);
    if (hasArena) w.float(entity.arenaData.values.rightX);
    if (hasPhysics) w.float(entity.physicsData.values.pushFactor);
    if (hasPhysics) w.vu(entity.physicsData.values.flags);
    if (hasArena) w.vu(entity.arenaData.values.scoreboardAmount);
    if (hasArena) w.float(entity.arenaData.values.ticksUntilStart);
    if (hasArena) w.float(entity.arenaData.values.topY);
    if (hasScore) w.float(entity.scoreData.values.score);
};

/** Entity update compiler function... Run! */
export const compileUpdate = (w: Writer, entity: Entity) => {
    w.entid(entity).raw(0, 1);


 /* <template> auto-generated */ 
    const hasRelations = !!entity.relationsData;
    const hasBarrel = !!entity.barrelData;
    const hasPhysics = !!entity.physicsData;
    const hasHealth = !!entity.healthData;
    const hasArena = !!entity.arenaData;
    const hasName = !!entity.nameData;
    const hasCamera = !!entity.cameraData;
    const hasPosition = !!entity.positionData;
    const hasStyle = !!entity.styleData;
    const hasScore = !!entity.scoreData;
    const hasTeam = !!entity.teamData;

    let at = -1;

 /* <template> auto-generated */ 
    if (hasPosition) if (entity.positionData.state[1]) {w.u8((0 - at) ^ 1); at = 0; w.vi(entity.positionData.values.y);};
    if (hasPosition) if (entity.positionData.state[0]) {w.u8((1 - at) ^ 1); at = 1; w.vi(entity.positionData.values.x);};
    if (hasPosition) if (entity.positionData.state[2]) {w.u8((2 - at) ^ 1); at = 2; w.float64Precision(entity.positionData.values.angle);};
    if (hasPhysics) if (entity.physicsData.state[2]) {w.u8((3 - at) ^ 1); at = 3; w.float(entity.physicsData.values.size);};
    if (hasCamera) if (entity.cameraData.state[2]) {w.u8((4 - at) ^ 1); at = 4; w.entid(entity.cameraData.values.player);};
    if (hasArena) if (entity.arenaData.state[0]) {w.u8((5 - at) ^ 1); at = 5; w.vu(entity.arenaData.values.flags);};
    if (hasStyle) if (entity.styleData.state[1]) {w.u8((6 - at) ^ 1); at = 6; w.vu(entity.styleData.values.color);};
    if (hasArena) if (entity.arenaData.state[8]) { w.u8((7 - at) ^ 1); at = -1; if (entity.arenaData.values.scoreboardColors.state[0]) { w.u8((0 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[0]); at = 0; } if (entity.arenaData.values.scoreboardColors.state[1]) { w.u8((1 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[1]); at = 1; } if (entity.arenaData.values.scoreboardColors.state[2]) { w.u8((2 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[2]); at = 2; } if (entity.arenaData.values.scoreboardColors.state[3]) { w.u8((3 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[3]); at = 3; } if (entity.arenaData.values.scoreboardColors.state[4]) { w.u8((4 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[4]); at = 4; } if (entity.arenaData.values.scoreboardColors.state[5]) { w.u8((5 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[5]); at = 5; } if (entity.arenaData.values.scoreboardColors.state[6]) { w.u8((6 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[6]); at = 6; } if (entity.arenaData.values.scoreboardColors.state[7]) { w.u8((7 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[7]); at = 7; } if (entity.arenaData.values.scoreboardColors.state[8]) { w.u8((8 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[8]); at = 8; } if (entity.arenaData.values.scoreboardColors.state[9]) { w.u8((9 - at) ^ 1); w.vu(entity.arenaData.values.scoreboardColors.values[9]); at = 9; } w.u8(1); at = 7; };
    if (hasCamera) if (entity.cameraData.state[16]) {w.u8((8 - at) ^ 1); at = 8; w.stringNT(entity.cameraData.values.killedBy);};
    if (hasArena) if (entity.arenaData.state[13]) {w.u8((9 - at) ^ 1); at = 9; w.vi(entity.arenaData.values.playersNeeded);};
    if (hasPhysics) if (entity.physicsData.state[1]) {w.u8((10 - at) ^ 1); at = 10; w.vu(entity.physicsData.values.sides);};
    if (hasTeam) if (entity.teamData.state[3]) {w.u8((11 - at) ^ 1); at = 11; w.vu(entity.teamData.values.flags);};
    if (hasHealth) if (entity.healthData.state[0]) {w.u8((12 - at) ^ 1); at = 12; w.vu(entity.healthData.values.flags);};
    if (hasArena) if (entity.arenaData.state[10]) { w.u8((13 - at) ^ 1); at = -1; if (entity.arenaData.values.scoreboardTanks.state[0]) { w.u8((0 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[0]); at = 0; } if (entity.arenaData.values.scoreboardTanks.state[1]) { w.u8((1 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[1]); at = 1; } if (entity.arenaData.values.scoreboardTanks.state[2]) { w.u8((2 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[2]); at = 2; } if (entity.arenaData.values.scoreboardTanks.state[3]) { w.u8((3 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[3]); at = 3; } if (entity.arenaData.values.scoreboardTanks.state[4]) { w.u8((4 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[4]); at = 4; } if (entity.arenaData.values.scoreboardTanks.state[5]) { w.u8((5 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[5]); at = 5; } if (entity.arenaData.values.scoreboardTanks.state[6]) { w.u8((6 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[6]); at = 6; } if (entity.arenaData.values.scoreboardTanks.state[7]) { w.u8((7 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[7]); at = 7; } if (entity.arenaData.values.scoreboardTanks.state[8]) { w.u8((8 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[8]); at = 8; } if (entity.arenaData.values.scoreboardTanks.state[9]) { w.u8((9 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardTanks.values[9]); at = 9; } w.u8(1); at = 13; };
    if (hasCamera) if (entity.cameraData.state[15]) {w.u8((14 - at) ^ 1); at = 14; w.vi(entity.cameraData.values.respawnLevel);};
    if (hasCamera) if (entity.cameraData.state[6]) {w.u8((15 - at) ^ 1); at = 15; w.float(entity.cameraData.values.levelbarProgress);};
    if (hasCamera) if (entity.cameraData.state[17]) {w.u8((16 - at) ^ 1); at = 16; w.vi(entity.cameraData.values.spawnTick);};
    if (hasPhysics) if (entity.physicsData.state[4]) {w.u8((17 - at) ^ 1); at = 17; w.float(entity.physicsData.values.absorbtionFactor);};
    if (hasArena) if (entity.arenaData.state[11]) {w.u8((18 - at) ^ 1); at = 18; w.float(entity.arenaData.values.leaderX);};
    if (hasHealth) if (entity.healthData.state[2]) {w.u8((19 - at) ^ 1); at = 19; w.float(entity.healthData.values.maxHealth);};
    if (hasStyle) if (entity.styleData.state[0]) {w.u8((20 - at) ^ 1); at = 20; w.vu(entity.styleData.values.flags);};
    if (hasBarrel) if (entity.barrelData.state[2]) {w.u8((22 - at) ^ 1); at = 22; w.float(entity.barrelData.values.trapezoidDirection);};
    if (hasPosition) if (entity.positionData.state[3]) {w.u8((23 - at) ^ 1); at = 23; w.vu(entity.positionData.values.flags);};
    if (hasArena) if (entity.arenaData.state[6]) { w.u8((24 - at) ^ 1); at = -1; if (entity.arenaData.values.scoreboardNames.state[0]) { w.u8((0 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[0]); at = 0; } if (entity.arenaData.values.scoreboardNames.state[1]) { w.u8((1 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[1]); at = 1; } if (entity.arenaData.values.scoreboardNames.state[2]) { w.u8((2 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[2]); at = 2; } if (entity.arenaData.values.scoreboardNames.state[3]) { w.u8((3 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[3]); at = 3; } if (entity.arenaData.values.scoreboardNames.state[4]) { w.u8((4 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[4]); at = 4; } if (entity.arenaData.values.scoreboardNames.state[5]) { w.u8((5 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[5]); at = 5; } if (entity.arenaData.values.scoreboardNames.state[6]) { w.u8((6 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[6]); at = 6; } if (entity.arenaData.values.scoreboardNames.state[7]) { w.u8((7 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[7]); at = 7; } if (entity.arenaData.values.scoreboardNames.state[8]) { w.u8((8 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[8]); at = 8; } if (entity.arenaData.values.scoreboardNames.state[9]) { w.u8((9 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardNames.values[9]); at = 9; } w.u8(1); at = 24; };
    if (hasCamera) if (entity.cameraData.state[14]) {w.u8((25 - at) ^ 1); at = 25; w.float(entity.cameraData.values.score);};
    if (hasTeam) if (entity.teamData.state[2]) {w.u8((26 - at) ^ 1); at = 26; w.float(entity.teamData.values.mothershipY);};
    if (hasArena) if (entity.arenaData.state[9]) { w.u8((27 - at) ^ 1); at = -1; if (entity.arenaData.values.scoreboardSuffixes.state[0]) { w.u8((0 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[0]); at = 0; } if (entity.arenaData.values.scoreboardSuffixes.state[1]) { w.u8((1 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[1]); at = 1; } if (entity.arenaData.values.scoreboardSuffixes.state[2]) { w.u8((2 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[2]); at = 2; } if (entity.arenaData.values.scoreboardSuffixes.state[3]) { w.u8((3 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[3]); at = 3; } if (entity.arenaData.values.scoreboardSuffixes.state[4]) { w.u8((4 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[4]); at = 4; } if (entity.arenaData.values.scoreboardSuffixes.state[5]) { w.u8((5 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[5]); at = 5; } if (entity.arenaData.values.scoreboardSuffixes.state[6]) { w.u8((6 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[6]); at = 6; } if (entity.arenaData.values.scoreboardSuffixes.state[7]) { w.u8((7 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[7]); at = 7; } if (entity.arenaData.values.scoreboardSuffixes.state[8]) { w.u8((8 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[8]); at = 8; } if (entity.arenaData.values.scoreboardSuffixes.state[9]) { w.u8((9 - at) ^ 1); w.stringNT(entity.arenaData.values.scoreboardSuffixes.values[9]); at = 9; } w.u8(1); at = 27; };
    if (hasName) if (entity.nameData.state[0]) {w.u8((28 - at) ^ 1); at = 28; w.vu(entity.nameData.values.flags);};
    if (hasCamera) if (entity.cameraData.state[20]) {w.u8((29 - at) ^ 1); at = 29; w.float(entity.cameraData.values.movementSpeed);};
    if (hasArena) if (entity.arenaData.state[12]) {w.u8((30 - at) ^ 1); at = 30; w.float(entity.arenaData.values.leaderY);};
    if (hasArena) if (entity.arenaData.state[4]) {w.u8((31 - at) ^ 1); at = 31; w.float(entity.arenaData.values.bottomY);};
    if (hasRelations) if (entity.relationsData.state[2]) {w.u8((32 - at) ^ 1); at = 32; w.entid(entity.relationsData.values.team);};
    if (hasCamera) if (entity.cameraData.state[4]) {w.u8((33 - at) ^ 1); at = 33; w.vi(entity.cameraData.values.level);};
    if (hasTeam) if (entity.teamData.state[0]) {w.u8((34 - at) ^ 1); at = 34; w.vu(entity.teamData.values.teamColor);};
    if (hasCamera) if (entity.cameraData.state[3]) {w.u8((35 - at) ^ 1); at = 35; w.float(entity.cameraData.values.FOV);};
    if (hasCamera) if (entity.cameraData.state[11]) { w.u8((36 - at) ^ 1); at = -1; if (entity.cameraData.values.statLimits.state[0]) { w.u8((0 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[0]); at = 0; } if (entity.cameraData.values.statLimits.state[1]) { w.u8((1 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[1]); at = 1; } if (entity.cameraData.values.statLimits.state[2]) { w.u8((2 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[2]); at = 2; } if (entity.cameraData.values.statLimits.state[3]) { w.u8((3 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[3]); at = 3; } if (entity.cameraData.values.statLimits.state[4]) { w.u8((4 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[4]); at = 4; } if (entity.cameraData.values.statLimits.state[5]) { w.u8((5 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[5]); at = 5; } if (entity.cameraData.values.statLimits.state[6]) { w.u8((6 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[6]); at = 6; } if (entity.cameraData.values.statLimits.state[7]) { w.u8((7 - at) ^ 1); w.vi(entity.cameraData.values.statLimits.values[7]); at = 7; } w.u8(1); at = 36; };
    if (hasArena) if (entity.arenaData.state[1]) {w.u8((37 - at) ^ 1); at = 37; w.float(entity.arenaData.values.leftX);};
    if (hasArena) if (entity.arenaData.state[7]) { w.u8((38 - at) ^ 1); at = -1; if (entity.arenaData.values.scoreboardScores.state[0]) { w.u8((0 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[0]); at = 0; } if (entity.arenaData.values.scoreboardScores.state[1]) { w.u8((1 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[1]); at = 1; } if (entity.arenaData.values.scoreboardScores.state[2]) { w.u8((2 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[2]); at = 2; } if (entity.arenaData.values.scoreboardScores.state[3]) { w.u8((3 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[3]); at = 3; } if (entity.arenaData.values.scoreboardScores.state[4]) { w.u8((4 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[4]); at = 4; } if (entity.arenaData.values.scoreboardScores.state[5]) { w.u8((5 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[5]); at = 5; } if (entity.arenaData.values.scoreboardScores.state[6]) { w.u8((6 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[6]); at = 6; } if (entity.arenaData.values.scoreboardScores.state[7]) { w.u8((7 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[7]); at = 7; } if (entity.arenaData.values.scoreboardScores.state[8]) { w.u8((8 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[8]); at = 8; } if (entity.arenaData.values.scoreboardScores.state[9]) { w.u8((9 - at) ^ 1); w.vi(entity.arenaData.values.scoreboardScores.values[9]); at = 9; } w.u8(1); at = 38; };
    if (hasCamera) if (entity.cameraData.state[10]) { w.u8((39 - at) ^ 1); at = -1; if (entity.cameraData.values.statLevels.state[0]) { w.u8((0 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[0]); at = 0; } if (entity.cameraData.values.statLevels.state[1]) { w.u8((1 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[1]); at = 1; } if (entity.cameraData.values.statLevels.state[2]) { w.u8((2 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[2]); at = 2; } if (entity.cameraData.values.statLevels.state[3]) { w.u8((3 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[3]); at = 3; } if (entity.cameraData.values.statLevels.state[4]) { w.u8((4 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[4]); at = 4; } if (entity.cameraData.values.statLevels.state[5]) { w.u8((5 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[5]); at = 5; } if (entity.cameraData.values.statLevels.state[6]) { w.u8((6 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[6]); at = 6; } if (entity.cameraData.values.statLevels.state[7]) { w.u8((7 - at) ^ 1); w.vi(entity.cameraData.values.statLevels.values[7]); at = 7; } w.u8(1); at = 39; };
    if (hasCamera) if (entity.cameraData.state[19]) {w.u8((40 - at) ^ 1); at = 40; w.stringNT(entity.cameraData.values.tankOverride);};
    if (hasCamera) if (entity.cameraData.state[5]) {w.u8((41 - at) ^ 1); at = 41; w.vi(entity.cameraData.values.tank);};
    if (hasStyle) if (entity.styleData.state[2]) {w.u8((42 - at) ^ 1); at = 42; w.float64Precision(entity.styleData.values.borderWidth);};
    if (hasCamera) if (entity.cameraData.state[18]) {w.u8((43 - at) ^ 1); at = 43; w.vi(entity.cameraData.values.deathTick);};
    if (hasPhysics) if (entity.physicsData.state[3]) {w.u8((44 - at) ^ 1); at = 44; w.float(entity.physicsData.values.width);};
    if (hasCamera) if (entity.cameraData.state[8]) {w.u8((45 - at) ^ 1); at = 45; w.vi(entity.cameraData.values.statsAvailable);};
    if (hasBarrel) if (entity.barrelData.state[0]) {w.u8((46 - at) ^ 1); at = 46; w.vu(entity.barrelData.values.flags);};
    if (hasCamera) if (entity.cameraData.state[7]) {w.u8((47 - at) ^ 1); at = 47; w.float(entity.cameraData.values.levelbarMax);};
    if (hasName) if (entity.nameData.state[1]) {w.u8((48 - at) ^ 1); at = 48; w.stringNT(entity.nameData.values.name);};
    if (hasRelations) if (entity.relationsData.state[1]) {w.u8((49 - at) ^ 1); at = 49; w.entid(entity.relationsData.values.owner);};
    if (hasHealth) if (entity.healthData.state[1]) {w.u8((50 - at) ^ 1); at = 50; w.float(entity.healthData.values.health);};
    if (hasCamera) if (entity.cameraData.state[13]) {w.u8((51 - at) ^ 1); at = 51; w.float(entity.cameraData.values.cameraY);};
    if (hasStyle) if (entity.styleData.state[3]) {w.u8((52 - at) ^ 1); at = 52; w.float(entity.styleData.values.opacity);};
    if (hasBarrel) if (entity.barrelData.state[1]) {w.u8((53 - at) ^ 1); at = 53; w.float(entity.barrelData.values.reloadTime);};
    if (hasCamera) if (entity.cameraData.state[9]) { w.u8((54 - at) ^ 1); at = -1; if (entity.cameraData.values.statNames.state[0]) { w.u8((0 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[0]); at = 0; } if (entity.cameraData.values.statNames.state[1]) { w.u8((1 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[1]); at = 1; } if (entity.cameraData.values.statNames.state[2]) { w.u8((2 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[2]); at = 2; } if (entity.cameraData.values.statNames.state[3]) { w.u8((3 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[3]); at = 3; } if (entity.cameraData.values.statNames.state[4]) { w.u8((4 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[4]); at = 4; } if (entity.cameraData.values.statNames.state[5]) { w.u8((5 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[5]); at = 5; } if (entity.cameraData.values.statNames.state[6]) { w.u8((6 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[6]); at = 6; } if (entity.cameraData.values.statNames.state[7]) { w.u8((7 - at) ^ 1); w.stringNT(entity.cameraData.values.statNames.values[7]); at = 7; } w.u8(1); at = 54; };
    if (hasCamera) if (entity.cameraData.state[12]) {w.u8((55 - at) ^ 1); at = 55; w.float(entity.cameraData.values.cameraX);};
    if (hasTeam) if (entity.teamData.state[1]) {w.u8((56 - at) ^ 1); at = 56; w.float(entity.teamData.values.mothershipX);};
    if (hasCamera) if (entity.cameraData.state[0]) {w.u8((57 - at) ^ 1); at = 57; w.vu(entity.cameraData.values.unusedClientId);};
    if (hasRelations) if (entity.relationsData.state[0]) {w.u8((58 - at) ^ 1); at = 58; w.entid(entity.relationsData.values.parent);};
    if (hasStyle) if (entity.styleData.state[4]) {w.u8((59 - at) ^ 1); at = 59; w.vu(entity.styleData.values.zIndex);};
    if (hasCamera) if (entity.cameraData.state[1]) {w.u8((60 - at) ^ 1); at = 60; w.vu(entity.cameraData.values.flags);};
    if (hasArena) if (entity.arenaData.state[3]) {w.u8((61 - at) ^ 1); at = 61; w.float(entity.arenaData.values.rightX);};
    if (hasPhysics) if (entity.physicsData.state[5]) {w.u8((62 - at) ^ 1); at = 62; w.float(entity.physicsData.values.pushFactor);};
    if (hasPhysics) if (entity.physicsData.state[0]) {w.u8((63 - at) ^ 1); at = 63; w.vu(entity.physicsData.values.flags);};
    if (hasArena) if (entity.arenaData.state[5]) {w.u8((64 - at) ^ 1); at = 64; w.vu(entity.arenaData.values.scoreboardAmount);};
    if (hasArena) if (entity.arenaData.state[14]) {w.u8((65 - at) ^ 1); at = 65; w.float(entity.arenaData.values.ticksUntilStart);};
    if (hasArena) if (entity.arenaData.state[2]) {w.u8((66 - at) ^ 1); at = 66; w.float(entity.arenaData.values.topY);};
    if (hasScore) if (entity.scoreData.state[0]) {w.u8((67 - at) ^ 1); at = 67; w.float(entity.scoreData.values.score);};

    w.u8(1); // close table
}