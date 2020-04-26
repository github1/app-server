const server = require('./server-core.js');

describe('when the server starts', () => {
  it('applies extensions', () => {
    const extension = {
      onSetup: jest.fn(),
      onStart: jest.fn()
    };
    return new Promise((resolve) => {
      const express = () => ({
        use: jest.fn(),
        engine: jest.fn(),
        set: jest.fn(),
        listen: (port, callback) => {
          setTimeout(() => {
            callback();
            resolve();
          }, 100);
          return 'fakeServer';
        },
        get: jest.fn()
      });
      express.static = jest.fn();
      server({
        cwd: () => '/tmp/foo',
        env: {}
      }, express, 3000, [extension]);
    }).then(() => {
      expect(extension.onSetup.mock.calls.length).toBe(1);
      expect(extension.onStart.mock.calls.length).toBe(1);
      expect(extension.onStart.mock.calls[0][0]).toEqual({port: 3000, env: 'development', server: 'fakeServer'});
    });
  });
});
