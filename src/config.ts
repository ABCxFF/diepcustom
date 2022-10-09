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

/** The build supported by the server. */
export const buildHash: string = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
/** The port the server is hosting its game server on. */
export const serverPort: number = parseInt(process.env.PORT || "8080");
/** Milliseconds per tick in the game. */
export const mspt: number = 40;
/** Max connections per ip. -1 = no limit */
export const connectionsPerIp: number = -1;

/** Host id to be sent to client. */
export const host: string = process.env.SERVER_INFO || (process.env.NODE_ENV === "development" ? "localhost" : "");
/** Runtime mode. */
export const mode: string = process.env.NODE_ENV || "development";

/** Magic number used for tank xor and stat xor. */
export const magicNum = (function magicNum(build: string) {
    let char;
    for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
        char = parseInt(build[i], 16);
        res ^= ((char << ((seed & 1) << 2)) << (timer << 3));
        timer = (timer + 1) & 3;
        seed ^= +!(timer);
    };
    return res >>> 0; // unsigned
})(buildHash);

/** Spatial Hashing CellSize for physics. Zero = quadtree. */
export const spatialHashingCellSize: number = 7;

/** Hashed (sha256) dev password */
export const devPasswordHash: string = process.env.DEV_PASSWORD_HASH || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

/** Whether or not Verbose Logs should be logged */
export const doVerboseLogs: boolean = false;

/** Access levels of each client. */
export const enum AccessLevel {
    FullAccess   = 3,
    BetaAccess   = 2,
    kReserved    = 1,
    PublicAccess = 0,
    NoAccess     = -1
}

// Every access level, including and above this one is unbannable via client.ban()
export const unbannableLevelMinimum: AccessLevel = AccessLevel.FullAccess;

/** The developer tokens by role (UNNECESSARY UNLESS DISCORD INTEGRATION) */
export const devTokens: Record<string, AccessLevel> = {
    "*": AccessLevel.BetaAccess
}

/** Should always be set to the url (UNNECESSARY UNLESS DISCORD INTEGRATION) */
export const origin: string = process.env.ORIGIN_URL || "http://localhost:8080";