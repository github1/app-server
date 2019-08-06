module.exports = app => {
  app.use((req, res, next) => {
    if (req.isHtml) { // Execute for text/html requests ...
      // Set page render props ...
      res.props({
        title: 'Hello, World!',
        includeBundle: false,
        head: ['$concat', [
          h => h('link', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'https://fonts.googleapis.com/css?family=Open+Sans'
          }),
          h => h('style', {
            dangerouslySetInnerHTML: {
              __html: 'div { font-family: \'Open Sans\', sans-serif; }'
            }
          })
        ]],
        body: ['$concat', h => h('div', {id: 'main'}, 'Hello, World!')]
      });
    }
    next();
  });
};


