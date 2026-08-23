process.chdir(__dirname);
process.argv = [process.argv[0], process.argv[1], "dev", "-p", "3002"];
require("./node_modules/next/dist/bin/next");
