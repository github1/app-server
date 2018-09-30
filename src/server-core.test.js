const server = require('./server-core.js');

describe('when the server starts', () => {
    it('applies extensions', () => {
        const express = () => ({
            use: jest.fn(),
            engine: jest.fn(),
            set: jest.fn(),
            listen: (port, callback) => {
                callback();
            },
            get: jest.fn()
        });
        express.static = jest.fn();
        const extension = {
            onSetup: jest.fn(),
            onStart: jest.fn()
        };
        server({
            cwd: () => '/tmp/foo',
            env: {}
        }, express, 3000, [extension]);
        expect(extension.onSetup.mock.calls.length).toBe(1);
        expect(extension.onStart.mock.calls.length).toBe(1);
    });
});