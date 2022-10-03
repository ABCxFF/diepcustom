const https = require("https");
const {join: joinPath} = require("path");
const fs = require("fs");

const BUILD = 'build_6f59094d60f98fafc14371671d3ff31ef4d75d9e';
if (!fs.existsSync(joinPath(__dirname, "public/img/"))) fs.mkdirSync(__dirname + "/public/img", {recursive: true});
const streamDownload = (url, path) => new Promise((r, rj) => {
    const fileStream = fs.createWriteStream(path);
    https.get(url, res => {
        res.pipe(fileStream);
        fileStream.on("finish", () => {
            fileStream.close();
            r()
        });
    }).on("error", rj);
});

let fileCount = 0;
const URL2PATH = [
    ["https://pastebin.com/raw/Nfpxf7jA", "/" + BUILD + ".wasm.js"],
    ["https://static.diep.io/" + BUILD + ".wasm.wasm", "/" + BUILD + ".wasm.wasm"],
    ["https://pastebin.com/raw/03FMssEw", "/c.js"],
    ["https://pastebin.com/raw/ENRJMkgb", "/index.html"],

    ["https://static.diep.io/youtube.png", "/img/youtube.png"],
    ["https://static.diep.io/facebook.png", "/img/facebook.png"],
    ["https://static.diep.io/google_play.png", "/img/google_play.png"],
    ["https://static.diep.io/reddit.png", "/img/reddit.png"],
    ["https://static.diep.io/title.png", "/img/title.png"],
    ["https://static.diep.io/wiki.png", "/img/wiki.png"],
    ["https://static.diep.io/app_store.svg", "/img/app_store.svg"],
    ["https://static.diep.io/favicon.ico", "/img/favicon-32x32.ico"],
    ["https://static.diep.io/favicon.ico", "/img/favicon-64x64.ico"], //:p
];

Promise.all(URL2PATH.map(([url, path]) => streamDownload(url, joinPath(__dirname, "public", path)).then(() => {
    console.log(`${++fileCount}/${URL2PATH.length} files downloaded (${path})`)
}, (err) => {
    console.log(`Error caught while attempting to download ${path}. Dumping error`);
    console.log(err);
}))).then(() => {
    if (fileCount === URL2PATH.length) console.log(`=====CLIENT SUCCESSFULLY DOWNLOADED=====`);
    else console.log("==================\nAll but " + (URL2PATH.length - fileCount) + " files have been downloaded")
})