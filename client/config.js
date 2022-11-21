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

const BUILD = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
const CDN = "https://static.diep.io/";
const API_URL = `${window.location.href}api/`;

const CHANGELOG = [
    "Updated recently",
    "",
    "Check out the GitHub repository!: github.com/ABCxFF/diepcustom",
    "Join our Discord server: discord.gg/SyxWdxgHnT :)"
];

const ASM_CONSTS = {
    1024: "createCanvasCtxWithAlpha",
    3781: "createImage",
    4211: "websocketSend",
    4388: "wipeContext",
    4528: "modulo",
    4551: "wipeSocket",
    4777: "setTextInput",
    4827: "wipeImage",
    4902: "reloadWindowTimeout",
    4968: "existsInWindowObject",
    5011: "empty", // ads
    5093: "empty", // ads
    5124: "empty", // ads
    5443: "empty", // ads
    5506: "empty", // ads
    5563: "empty", // ads
    5827: "getQueries",
    6547: "empty", // ads
    6927: "empty", // ads
    7068: "getLocalStorage",
    7293: "deleteLocalStorage",
    7343: "removeChildNode",
    7449: "checkElementProperty",
    7675: "existsQueryOrIsBlank",
    7886: "empty", // ads
    8008: "setLocalStorage",
    8254: "empty", // ads
    8472: "empty", // ads
    9178: "empty", // ads
    9362: "getGamepad",
    9558: "toggleFullscreen",
    10188: "getCanvasSize",
    10299: "setCursorDefault",
    10363: "setCursorPointer",
    10427: "setCursorText",
    10488: "getTextInput",
    10530: "enableTyping",
    11181: "disableTyping",
    11296: "focusCanvas",
    11444: "setCanvasSize",
    11529: "empty", // anti cheat
    11586: "copyUTF8",
    11637: "alert",
    11884: "saveContext",
    11952: "restoreContext",
    12020: "scaleContextAlpha",
    12063: "empty", // ads
    12501: "empty", // ads
    12976: "empty", // ads
    13247: "empty", // ads
    13331: "empty", // ads
    13414: "setContextFillStyle",
    13493: "setContextTransform",
    13560: "contextFillRect",
    13611: "contextBeginPath",
    13645: "contextClip",
    13674: "contextFill",
    13703: "setContextLineJoinRound",
    13744: "setContextLineJoinBevel",
    13785: "setContextLineJoinMiter",
    13826: "setContextLineWidth",
    13863: "setContextStrokeStyle",
    13939: "setContextTransformBounds",
    14002: "contextStroke",
    14033: "contextRect",
    14072: "getFontsLoaded",
    14174: "setContextFont",
    14240: "measureContextTextWidth",
    14308: "setContextAlpha",
    14347: "contextFillText",
    14402: "contextStrokeText",
    14459: "setContextTextBaselineTop",
    14502: "setContextTextBaselineHanging",
    14549: "setContextTextBaselineMiddle",
    14595: "setContextTextBaselineAlphabetic",
    14645: "setContextTextBaselineIdeographic",
    14696: "setContextTextBaselineBottom",
    15084: "setContextTransformNormalize",
    15137: "contextMoveTo",
    15178: "contextLineTo",
    15215: "contextClosePath",
    15288: "contextArc",
    16282: "copyToKeyboard",
    16505: "setLocation",
    16959: "contextDrawImage",
    24403: "getImage",
    24601: "contextDrawCanvas",
    24706: "setContextLineCapButt",
    24745: "setContextLineCapRound",
    24785: "setContextLineCapSquare",
    25012: "contextStrokeRect",
    25057: "contextDrawFullCanvas",
    25399: "isContextPatternAvailable",
    25462: "createContextPattern",
    25748: "contextGetPixelColor",
    25862: "contextDrawCanvasSourceToPixel",
    25954: "contextFillRectWithPattern",
    26051: "wipePattern",
    26281: "empty", // ?
    26345: "empty", // ?
    26430: "existsQuery",
    26890: "empty", // anti cheat
    26958: "canvasHasSamePropertyAsDocumentBody",
    27065: "existsDocumentBodyProperty",
    27120: "existsDocumentBodyProperty2",
    27166: "existsDivPropertyAndEqualsPropertyOnDocumentBody",
    27326: "empty", // anti cheat
    27575: "empty", // anti cheat
    27656: "empty", // anti cheat
    27778: "acCheckWindow", // anti cheat
    27886: "getDocumentBody",
    27945: "empty", // anti cheat
    28057: "empty", // anti cheat
    28125: "getUserAgent",
    28186: "empty", // anti cheat
    28407: "getQuerySelectorToString",
    28509: "getFillTextToString",
    28632: "getStrokeRectToString",
    28757: "getStrokeTextToString",
    28882: "getScaleToString",
    29002: "getTranslateToString",
    29126: "getFillRectToString",
    29249: "getRotateToString",
    29370: "getGetImageDataToString",
    29518: "empty", // ads
    29633: "contextClearRect",
    29740: "createCanvasCtx",
    29980: "setContextMiterLimit",
    30178: "getWindowLocation",
    30225: "setLoadingStatus",
    30352: "m28nReply",
    30767: "isSSL",
    30836: "createWebSocket",
    31548: "findServerById",
    31923: "invalidPartyId",
    31954: "wipeLocation",
    32047: "getGamepadAxe",
    32156: "getGamepadButtonPressed",
    32290: "pollWebSocketEvent",
    32446: "updateToNewVersion",
    32506: "empty", // pow
    32813: "reloadWindow",
    32840: "getWindowLocationSearch",
    32889: "getWindowReferrer",
    33085: "empty", // fingerprinting
    33169: "empty", // fingerprinting
    33222: "empty", // fingerprinting
    33330: "empty", // fingerprinting
    33425: "empty", // fingerprinting
    33488: "empty", // fingerprinting
    33528: "empty", // fingerprinting
};

const WASM_IMPORTS = {
    "i": "assertFail",
    "q": "mapFile",
    "p": "sysMunmap",
    "b": "abort",
    "d": "asmConstsDII",
    "a": "asmConstsIII",
    "j": "exitLive",
    "m": "exitForce",
    "g": "getNow",
    "n": "memCopyBig",
    "e": "random",
    "f": "resizeHeap",
    "r": "setMainLoop",
    "k": "envGet",
    "l": "envSize",
    "h": "fdWrite",
    "c": "roundF",
    "o": "timeString",
    "memory": "wasmMemory",
    "table": "wasmTable"
};

const WASM_EXPORTS = {
    "s": "wasmCallCtors", // constructors
    "t": "connect", // used to connect to ip, unused
    "u": "hasTank", // does player have a tank
    "v": "setConvar", // sets console var
    "w": "getConvar", // gets console var
    "x": "execute", // execute console cmd
    "y": "printConsoleHelp", // prints console help
    "z": "main", // main function
    "A": "checkWS", // polls ws
    "B": "free", // frees memory
    "C": "videoAdsLoaded", // event for ads loaded, unused
    "D": "videoAdsDone", // event for ad done, unused
    "E": "mouse", // sets mouse pos
    "F": "keyDown", // sets key down
    "G": "keyUp", // sets key up
    "H": "resetKeys", // resets key listeners
    "I": "preventRightClick", // should prevent right click if true
    "J": "flushInputHooks", // flushes all inputs (keys, mouse, gamepad)
    "K": "mouseWheel", // sets mouse wheel delta
    "L": "cp5Idle", // idle mode, unused
    "M": "cp5Destroy", // destroy cp5 obj, unused
    "N": "powResult", // pow result, unused 
    "O": "restReply", // server finder reply 
    "P": "getErrorLocation", // gets pointer for setting error code
    "Q": "malloc", // allocates memory
    "R": "dynCallVI", // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
    "S": "dynCallV" // dynamic func call (v = void, i = integer as arg, d = double as arg, f = float as arg)
};

const MOD_CONFIG = {
    "wasmFunctions": {
        "loadGamemodeButtons": 296,
        "loadVectorDone": 22,
        "loadChangelog": 447,
        "loadTankDefinitions": 277,
        "getTankDefinition": 101,
        "findCommand": 496
    },
    "memory": {
        "gamemodeButtons": 113480,
        "changelog": 167328,
        "changelogLoaded": 168632,
        "tankDefinitions": 166572,
        "tankDefinitionsCount": 166576,
        "commandList": 53064
    },
    "wasmFunctionHookOffset": {
        "gamemodeButtons": 33,
        "changelog": 28
    }
};

const ADDON_MAP = {
    "barrelAddons": {
        "trapLauncher": 147
    },
    "tankAddons": {
        "auto3": 148,
        "smasher": 149,
        "pronounced": 150,
        "landmine": 151,
        "auto5": 153,
        "autoturret": 154, // Auto Trapper (154) & Auto Gunner (152)
        "autosmasher": 155,
        "spike": 156,
        "launcher": 157, // Skimmer (157) & Rocketeer (158)
        "dombase": 159,
        "dompronounced": 160, // Dom1 (160) & Dom2 (161) 
    }
};

const CUSTOM_COMMANDS = [
    {
        "id": "test",
        "description": "Test command to check if custom commands are working, prints 'Hello World' to the console",
        "callback": args => { // array of strings, you need to parse them yourself
            console.log("Hello World");
        }
    }, {
        "id": "util_reload_servers",
        "usage": "[?interval]",
        "description": "Sets the interval in which gamemodes are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadServersInterval = -1;
                        case "connect":
                            return Module.reloadServersInterval = -2;
                    }
                }
                return Module.reloadServersInterval = num;
            }
            Game.reloadServers();
        }
    }, {
        "id": "util_reload_tanks",
        "usage": "[?interval]",
        "description": "Sets the interval in which tanks are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadTanksInterval = -1;
                        case "connect":
                            return Module.reloadTanksInterval = -2;
                    }
                }
                return Module.reloadTanksInterval = num;
            }
            Game.reloadTanks();
        }
    }, {
        "id": "util_reload_commands",
        "usage": "[?interval]",
        "description": "Sets the interval in which commands are reloaded automatically (milliseconds, 'never' or 'connect') or reloads once if no interval is given",
        "callback": args => {
            if(args[0]) {
                const num = parseInt(args[0]);
                if(isNaN(num)) {
                    switch(args[0]) {
                        case "never":
                            return Module.reloadCommandsInterval = -1;
                        case "connect":
                            return Module.reloadCommandsInterval = -2;
                    }
                }
                return Module.reloadCommandsInterval = num;
            }
            Game.reloadCommands();
        }
    }, {
        "id": "util_set_changelog",
        "usage": "[line 1\\n] [line 2] ...",
        "description": "Sets the changelog to the given text, remember to use \\n before and after each line",
        "callback": args => {
            Game.changeChangelog(args.join(' ').split("\\n"));
        }
    }
];

const COMMANDS_LOOKUP = {
    "con_toggle": 52952,
    "game_spawn": 52992,
    "help": 49956,
    "lb_reconnect": 50056,
    "net_replace_color": 50152,
    "net_replace_colors": 50192,
    "ui_replace_colors": 49916
};

const WASM_TABLE = {
    "initial": 687,
    "element": "anyfunc"
};

const INITIAL_MEMORY = 67108864;
const WASM_PAGE_SIZE = 65536; // A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB

const DYNAMIC_BASE = 5426112; // start of dynmic memory
const DYNAMIC_TOP_PTR = 183072; // points to start of dynamic memory

const WASM_MEMORY = {
    "initial": INITIAL_MEMORY / WASM_PAGE_SIZE,
    "maximum": INITIAL_MEMORY / WASM_PAGE_SIZE
};
