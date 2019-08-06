#!/usr/bin/env node
const path = require('path');
const server = require('../src/index.js');
let serverJS = process.argv[2];
if (serverJS) {
  serverJS = path.resolve(serverJS);
} else {
  serverJS = path.resolve((process.env.SERVICE_BASE_DIR || process.cwd()), 'server.js');
}
server([serverJS]);
