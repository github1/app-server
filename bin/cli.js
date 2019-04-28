#!/usr/bin/env node
const path = require('path');
const server = require('../src/index.js');
const baseDir = process.env.SERVICE_BASE_DIR || process.cwd();
const serverJS = path.join(baseDir, 'server.js');

server([serverJS]);