const core = require('./server-core');
const express = require('express');
module.exports = (extensions, port, proc) => {
    proc = proc || process;
    port = port || proc.env['PORT'] || 3000;
    core(proc, express, port, extensions);
};