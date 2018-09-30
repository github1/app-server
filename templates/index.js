const React = require('react');

const createElements = require('../src/create-elements');

const h = function () {
    return [].slice.apply(arguments);
};

exports.default = function (props) {
    var cleanedProps = JSON.parse(JSON.stringify(props));
    delete cleanedProps.settings;
    delete cleanedProps.head;
    delete cleanedProps.body;
    delete cleanedProps._locals;
    delete cleanedProps.cache;
    return React.createElement(
        'html',
        {lang: 'en'},
        React.createElement(
            'head',
            null,
            props.head.map(function (renderer) {
                return createElements(renderer(h, props));
            }),
            React.createElement('meta', {charSet: 'utf-8'}),
            React.createElement('meta', {
                httpEquiv: 'X-UA-Compatible',
                content: 'IE=edge'
            }),
            React.createElement('meta', {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0'
            }),
            React.createElement('meta', {
                name: 'apple-mobile-web-app-capable',
                content: 'yes'
            }),
            React.createElement('meta', {
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'black'
            }),
            React.createElement('title', null, props.title),
            React.createElement('link', {
                rel: 'shortcut icon',
                href: props.favicon
            }),
            React.createElement('script', {
                type: 'text/javascript',
                dangerouslySetInnerHTML: {
                    __html: 'window.props = ' + JSON.stringify(cleanedProps) + ';'
                }
            })
        ),
        React.createElement(
            'body',
            null,
            props.body.map(function (renderer) {
                return createElements(renderer(h, cleanedProps));
            }),
            props.includeBundle
                ? React.createElement('script', {
                src: `/assets/${props.cacheKey}/main.bundle.js`
            })
                : null
        )
    );
};
