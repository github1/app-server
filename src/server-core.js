const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const serveStatic = require('./serve-static-fallback');
const amfMiddleware = require('./amf-middleware');
const oneDay = 86400000;
const cacheRegExp = /\/c[0-9^\/]+\//;
const cacheKey = 'c' + new Date().getTime();

module.exports = (process, express, port, extensions) => {

    const smerge = require('@github1/smerge');

    extensions = extensions || [];

    const loadAppServerExtension = (extensionSrc) => {
        if (fs.existsSync(extensionSrc)) {
            console.log(chalk.blue('[app-server]') + ' Applying server extension:\n\t' + chalk.green(extensionSrc));
            const extension = require(extensionSrc);
            return extension.default ? extension.default : extension;
        }
        return null;
    };

    extensions = extensions
        .map(extension => {
            return typeof extension === 'string' ? loadAppServerExtension(extension) : extension;
        })
        .filter(extension => extension !== null)
        .map(extension => typeof extension === 'function' ? {
            onSetup: extension
        } : extension);

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const app = express();
    const workDir = process.env.SERVICE_BASE_DIR || process.cwd();

    const extensionContext = {
        port: port,
        env: isDevelopment ? 'development' : 'production'
    };

    app.engine('js', (() => {
        const ReactDOMServer = require('react-dom/server');
        return (path, data, cb) => {
            if (isDevelopment) {
                delete require.cache[require.resolve(path)];
            }
            cb(null, data.replacers.reduce((res, cur) => {
                res = cur(res);
                return res;
            }, '<!doctype html>\n' + ReactDOMServer
                    .renderToString(require(path).default(data.props))));
        }
    })());
    app.set('view engine', 'js');
    app.set('views', [workDir + '/templates', path.resolve(__dirname + '/../templates')]);

    app.use(compression());
    app.use(amfMiddleware());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());

    // template props
    app.use((req, res, next) => {
        const cacheKeyToUse = isDevelopment ? ('c' + new Date().getTime()) : cacheKey;
        // simple way to check if request is for html view
        req.isHtml = /text\/html/i.test(req.headers.accept || 'unknown')
            && !/\.[a-z]+$/i.test(req.path);
        res._props = res._props || {
                path: req.path,
                queryParams: req.query,
                device: {fallback: /Edge\/|Trident\/|MSIE /i.test(req.headers['user-agent'])},
                favicon: `/assets/${cacheKeyToUse}/favicon.ico`,
                head: [],
                body: [],
                includeBundle: true,
                cacheKey: cacheKeyToUse
            };
        res._replacers = [];
        res.props = updates => {
            if (typeof updates === 'function') {
                updates = updates(res._props);
            }
            res._props = smerge(res._props, updates);
        };
        res.replacer = replacer => {
            res._replacers.push(replacer);
        };
        next();
    });

    // add cache headers
    app.use((req, res, next) => {
        if(cacheRegExp.test(req.path)) {
            var expires = oneDay * 365;
            res.setHeader('Cache-Control', 'public, max-age=' + expires);
            res.setHeader('Expires', new Date(Date.now() + expires).toUTCString());
            req.url = req.url.replace(cacheRegExp, '/');
            next();
        } else {
            next();
        }
    });

    app.use(serveStatic(fs, [
        isDevelopment ? undefined : path.join(workDir, 'target/dist/public/assets'),
        path.join(workDir, 'assets'),
        path.join(__dirname, '../assets')
    ]));

    app.get('/version', (req, res) => {
        const versionFile = path.resolve(workDir, 'version.txt');
        fs.stat(versionFile, err => {
            if (err) {
                res.send('unknown');
            } else {
                res.sendFile(versionFile);
            }
        });
    });

    app.get('/force-error', () => {
        throw new Error('forced error');
    });

    extensions
        .forEach(extension => {
            if (extension.onSetup) {
                extension.onSetup(app, extensionContext);
            }
        });

    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500);
        if (res.props) {
            res.props({
                title: 'Internal Server Error',
                serverError: true
            });
        }
        next();
    });

    app.get('/*', (req, res, next) => {
        if (req.isHtml) {
            res.render('index', Object.assign({}, {
                title: 'No Title'
            }, {
                replacers: res._replacers,
                props: res._props
            }));
        } else {
            next();
        }
    });

    const server = app.listen(port, () => {
        extensions
            .forEach(extension => {
                extensionContext.server = server;
                if (extension.onStart) {
                    extension.onStart(extensionContext);
                }
            });
        console.log(chalk.blue('[app-server]') + ' Listening on port ' + chalk.green(port));
    });
    return server;
};
