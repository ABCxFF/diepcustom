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
import { join } from "path";


const PORT = config.serverPort;

const staticFilePath = join(__dirname, "/../client/public");
const isHostingClient = fs.existsSync(staticFilePath);
const games: GameServer[] = [];
if (isHostingClient) {
    util.log("Client files exist and are now being hosted (" + staticFilePath + ")");
}
const server = http.createServer((req, res) => {
    util.log("Incoming request to " + req.url);

    // For hosting the frontend
    if (isHostingClient) {
        let path = "";
        if (req.url?.startsWith("/api/interactions") && auth) {
            util.saveToVLog("someone attempting /claim");
            return auth.handleInteraction(req, res);
        }
        if (req.url?.startsWith("/claim/") && auth) {
            path = "/claim.html";
        } else {
            switch (req.url) {
                case "/":
                    util.saveToVLog("someone opening up the page");
                    path = "/index.html";
                    break;
                case "/build_6f59094d60f98fafc14371671d3ff31ef4d75d9e.wasm.wasm":
	                res.setHeader("Content-Type", "application/wasm");
                case "/build_6f59094d60f98fafc14371671d3ff31ef4d75d9e.wasm.js":
                case "/c.js":
                    path = req.url;
                    break;
                case "/ext/token/":
                case "/ext/token":
                    path = "/ext/token.html";
                    break;
                case "/app_store.svg":
	                res.setHeader("Content-Type", "image/svg+xml");
                case "/google_play.png": // return res.writeHead(200).end();
                case "/facebook.png":
                case "/reddit.png":
                case "/title.png":
                case "/wiki.png":
                case "/youtube.png":
                case "/favicon-32x32.ico":
                case "/favicon-64x64.ico":
                    path = "/img" + req.url;
                    break;
                default:
                    util.saveToVLog("404. someone has just requested " + req.url)
                    // Lol
                    return res.end('<html><head><title>404 Not Found</title></head>\n<body bgcolor="white">\n<center><h1>404 Not Found</h1></center>\n<hr><center>nginx/1.8.0 (Ubuntu)</center>\n\n\n\n\n\n\n\n\n</body></html>');
            }
        }

        fs.readFile(join(staticFilePath, path), function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);

            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

const wss = new WebSocket.Server({
    server,
    maxPayload: 2000
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
    const ffa = new GameServer(wss, "ffa", "ffa");
    const sbx = new GameServer(wss, "sandbox", "*");

    games.push(ffa, sbx);

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
