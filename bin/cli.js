#!/usr/bin/env node
const path = require('path');
const server = require('../src/index.js');
const fs = require('fs');

let serverJS = process.argv[2];
if (serverJS) {
  serverJS = [path.resolve(serverJS)];
} else {
  const basedir = (process.env.SERVICE_BASE_DIR || process.cwd());
  serverJS = fs.readdirSync(basedir)
    .filter((file) => process.env.LOAD_ALL_SERVICES ? /^server\..*js$/.test(file) : 'server.js' === file)
    .map((file) => path.resolve(basedir, file));
}
server(serverJS);
