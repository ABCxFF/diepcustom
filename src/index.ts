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

const PORT = config.serverPort;
const ENABLE_API = config.enableApi && config.apiLocation;
const ENABLE_CLIENT = config.enableClient && config.clientLocation && fs.existsSync(config.clientLocation);

if(ENABLE_API) util.log(`Rest API hosting is enabled and is now being hosted at /${config.apiLocation}`);
if(ENABLE_CLIENT) util.log(`Client hosting is enabled and is now being hosted from ${config.clientLocation}`);

const games: GameServer[] = [];

const server = http.createServer((req, res) => {
    util.log("Incoming request to " + req.url);

    if(ENABLE_API && req.url?.startsWith(`/${config.apiLocation}`)) {
	    switch(req.url.slice(config.apiLocation.length + 1)) {
            case "/": // check for api enabled
                res.writeHead(200);
                return res.end();
            case "/interactions": // discord interaction
                if(!auth) return;
                util.saveToVLog("Authentication attempt");
                return auth.handleInteraction(req, res);
        }
	}
    
    if(ENABLE_CLIENT) {
        const file = config.clientLocation + (req.url === "/" ? "/index.html" : req.url);
        console.log(file);
        if(file && fs.existsSync(file)) {
            res.writeHead(200);
            return res.end(fs.readFileSync(file))
        }
        res.writeHead(404);
        return res.end(fs.readFileSync(config.clientLocation + "/404.html"))
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
    util.log("Listening on port " + PORT + "");

    // RULES(0): Always put a endpoint=* gameserver at the end
    // RULES(1): No two game servers should share the same endpoint;
    //
    // NOTES(0): As of now, both servers run on the same process (and thread) here
    // NOTES(1): This does not update the index.html - server list was always static, so you need to modify html first (see "Survival" in html)
    const jungle = new GameServer(wss, "jungle", "survival");
    const sbx = new GameServer(wss, "ffa", "*");

    games.push(jungle, sbx);

    util.saveToLog("Servers up", "All servers booted up.", 0x37F554);
    util.log("Dumping endpoint -> gamemode routing table");
    for (const game of games) {
        const url = game.endpoint !== "*" ? "localhost:" + config.serverPort + "/game/diepio-" + game.endpoint : "the rest" ;
        console.log("> " + url.padEnd(40, " ") + " -> " + game.gamemode);
    }
});

process.on("uncaughtException", (error) => {
    util.saveToLog("Uncaught Exception", '```\n' + error.stack + '\n```', 0xFF0000)

    throw error;
});
