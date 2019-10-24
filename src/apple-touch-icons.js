module.exports = (app, icons) => {
    app.use((req, res, next) => {

        if (req.isHtml) {
            res.props({
                head: ['$concat', Object.keys(icons.output)
                    .map(key => icons.output[key])
                    .map(icon => h => {
                        return h('link', {
                            rel: 'apple-touch-icon-precomposed',
                            sizes: icon.id,
                            href: `/assets/apple-touch-icon-${icon.id}.png`
                        });
                    })]
            });
            next();
            return;
        }

        const matches = req.path.match(/apple-touch-icon-([^.]+).png$/i);
        if (matches) {
            const icon = icons.output[matches[1]];
            if (icon) {
                const buffer = Buffer.from(icon.data, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': buffer.length
                });
                res.end(buffer);
                return;
            }
        }
        next();
    });
};
