const { exec } = require("child_process");

const REQUIRED_MAJOR_VERSION = 16;

const current_version = process.version;
const current_major_version = parseInt(current_version.substring(1, current_version.indexOf('.')));

if (current_major_version < REQUIRED_MAJOR_VERSION) {
    console.log(`Version does not satisfy. Required: v${REQUIRED_MAJOR_VERSION}.x Current: ${current_version}`);
    process.exit(1);
}

console.log("Installing...");

exec('npm i', (error, stdout, stderr) => {
    console.log(stderr);
    console.log(stdout);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});