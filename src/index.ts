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

import * as http from "http";
import * as fs from "fs";
import * as WebSocket from "ws";
import * as config from "./config"
import * as util from "./util";
import GameServer from "./Game";
import auth from "./Auth";
import TankDefinitions from "./Const/TankDefinitions";
import { commandDefinitions } from "./Const/Commands";

const PORT = config.serverPort;
const ENABLE_API = config.enableApi && config.apiLocation;
const ENABLE_CLIENT = config.enableClient && config.clientLocation && fs.existsSync(config.clientLocation);

if (ENABLE_API) util.log(`Rest API hosting is enabled and is now being hosted at /${config.apiLocation}`);
if (ENABLE_CLIENT) util.log(`Client hosting is enabled and is now being hosted from ${config.clientLocation}`);

const games: GameServer[] = [];

const server = http.createServer((req, res) => {
    util.saveToVLog("Incoming request to " + req.url);

    res.setHeader("Server", "github.com/ABCxFF/diepcustom");

    if (ENABLE_API && req.url?.startsWith(`/${config.apiLocation}`)) {
        switch (req.url.slice(config.apiLocation.length + 1)) {
            case "/":
                res.writeHead(200);
                return res.end();
            case "/interactions": // discord interaction
                if (!auth) return;
                util.saveToVLog("Authentication attempt");
                return auth.handleInteraction(req, res);
            case "/tanks":
                res.writeHead(200);
                return res.end(JSON.stringify(TankDefinitions));
            case "/servers":
                res.writeHead(200);
                return res.end(JSON.stringify(games.map(({ gamemode, name }) => ({ gamemode, name }))));
            case "/commands":
                res.writeHead(200);
                return res.end(JSON.stringify(config.enableCommands ? Object.values(commandDefinitions) : []));
        }
    }

    if (ENABLE_CLIENT) {
        let file: string | null = null;
        let contentType = "text/html"
        switch (req.url) {
            case "/":
                file = config.clientLocation + "/index.html";
                contentType = "text/html";
                break;
            case "/loader.js":
                file = config.clientLocation + "/loader.js";
                contentType = "application/javascript";
                break;
            case "/input.js":
                file = config.clientLocation + "/input.js";
                contentType = "application/javascript";
                break;
            case "/dma.js":
                file = config.clientLocation + "/dma.js";
                contentType = "application/javascript";
                break;
            case "/config.js":
                file = config.clientLocation + "/config.js";
                contentType = "application/javascript";
                break;
        }

        res.setHeader("Content-Type", contentType + "; charset=utf-8");

        if (file && fs.existsSync(file)) {
            res.writeHead(200);
            return res.end(fs.readFileSync(file));
        }

        res.writeHead(404);
        return res.end(fs.readFileSync(config.clientLocation + "/404.html"));
    } 
});

const wss = new WebSocket.Server({
    server,
    maxPayload: config.wssMaxMessageSize,
});

const endpointMatch = /\/game\/diepio-.+/;
// We are override this to allow for checking gamemodes
wss.shouldHandle = function(request: http.IncomingMessage) {
    const url = (request.url || "/");

    if (url.length > 100) return false;

    return endpointMatch.test(url);
}

server.listen(PORT, () => {
    util.log(`Listening on port ${PORT}`);

    // RULES(0): No two game servers should share the same endpoint
    //
    // NOTES(0): As of now, both servers run on the same process (and thread) here
    const ffa = new GameServer(wss, "ffa", "FFA");
    const sandbox = new GameServer(wss, "sandbox", "Sandbox");

    games.push(ffa, sandbox);

    util.saveToLog("Servers up", "All servers booted up.", 0x37F554);
    util.log("Dumping endpoint -> gamemode routing table");
    for (const game of games) console.log("> " + `localhost:${config.serverPort}/game/diepio-${game.gamemode}`.padEnd(40, " ") + " -> " + game.name);
});

process.on("uncaughtException", (error) => {
    util.saveToLog("Uncaught Exception", '```\n' + error.stack + '\n```', 0xFF0000);

    throw error;
});
