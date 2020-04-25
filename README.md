# @github1/app-server

[description]

[badges]

## Install
```shell
npm install @github1/app-server --save
```

## Usage

Create a file called `server.js` with which exports a function like:

```javascript
module.exports = app => {
  // See ./server-example.js for an example of this
};
```

The `app` argument is a reference to an internally managed [Express](https://expressjs.com/) server. Run the `app-server` bin to start the server.

```shell
./node_modules/.bin/app-server
```

You can optionally set the port by setting an environment variable called `PORT`:

```shell
PORT=9999 ./node_modules/.bin/app-server
```

By default the server will look for a file called `server.js` but a different 
file may be passed as the first argument to the `app-server` binary:

```shell
./node_modules/.bin/app-server ./some-other-server.js
```

## License
[license]