#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const server = require('../src/index.js');
const baseDir = process.env.SERVICE_BASE_DIR || process.cwd();
const serverJS = path.join(baseDir, 'server.js');

server([serverJS, {
        onStart: context => {
            console.log('Listening on port ' + context.port);
        }
    }
]);