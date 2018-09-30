const serveStatic = require('./serve-static-fallback');
const path = require('path');

describe('serve-static-fallback', () => {
    let files;
    let fs = {
        stat: (path, callback) => {
            if (files.indexOf(path) > -1) {
                callback();
            } else {
                callback(new Error('File not found'));
            }
        }
    };
    let req;
    let res;
    let next;
    beforeEach(() => {
        files = [];
        req = {};
        res = {
            sendFile: jest.fn()
        };
        next = jest.fn();
    });
    describe('when a request is made for a resource', () => {
        describe('when it exists in the first dir', () => {
            it('serves the file from the dir', () => {
                files.push(path.resolve(__dirname, 'some-file.txt'));
                files.push(path.resolve('/foo/bar/baz/some-file.txt'));
                req.path = '/assets/some-file.txt';
                serveStatic(fs, [__dirname, '/foo/bar/baz'])(req, res, next);
                expect(res.sendFile.mock.calls.length).toBe(1);
                expect(res.sendFile.mock.calls[0][0]).toBe(files[0]);
            });
        });
        describe('when it exists in the second dir', () => {
            it('serves the file from the dir', () => {
                files.push(path.resolve(__dirname, 'a-file.txt'));
                files.push(path.resolve('/foo/bar/baz/some-file.txt'));
                req.path = '/assets/some-file.txt';
                serveStatic(fs, [__dirname, '/foo/bar/baz'])(req, res, next);
                expect(res.sendFile.mock.calls.length).toBe(1);
                expect(res.sendFile.mock.calls[0][0]).toBe(files[1]);
            });
        });
        describe('when it is not found in any dir', () => {
            it('calls next', () => {
                files.push(path.resolve(__dirname, 'a-file.txt'));
                files.push(path.resolve('/foo/bar/baz/some-file.txt'));
                req.path = '/assets/blah-file.txt';
                serveStatic(fs, [__dirname, '/foo/bar/baz'])(req, res, next);
                expect(next.mock.calls.length).toBe(1);
            });
        });
        describe('when the path does not match assets', () => {
            it('calls next', () => {
                req.path = '/blah/blah-file.txt';
                serveStatic(fs, [__dirname, '/foo/bar/baz'])(req, res, next);
                expect(next.mock.calls.length).toBe(1);
            });
        });
    });
});