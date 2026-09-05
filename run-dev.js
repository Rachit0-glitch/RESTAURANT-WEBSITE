process.chdir(__dirname);

// This project lives inside OneDrive, which actively syncs the .next build
// folder while webpack writes numbered chunk files into it. OneDrive can
// lock/delay/move a chunk mid-write, so a later require() for that exact
// chunk (e.g. "Cannot find module './819.js'") fails — the dev server then
// needs a full stop + `.next` wipe + restart to recover. Two changes make
// that permanent instead of a manual fix every time:
//
// 1. Wipe .next before every dev server start, so a corrupted cache from a
//    previous run can never carry over — each start is guaranteed clean.
// 2. Use Turbopack (--turbo) instead of webpack for dev. Turbopack doesn't
//    emit the same many-small-numbered-chunk-files-on-disk structure that a
//    syncing cloud folder tends to corrupt, so it isn't just self-healing
//    but far less likely to hit this class of error in the first place.
const fs = require("fs");
const path = require("path");

fs.rmSync(path.join(__dirname, ".next"), { recursive: true, force: true });

process.argv = [process.argv[0], process.argv[1], "dev", "-p", "3002", "--turbo"];
require("./node_modules/next/dist/bin/next");
