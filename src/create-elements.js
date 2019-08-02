const React = require('react');

const createElementFromData = (def, index, keyPrefix) => {
    index = index || 0;
    if (typeof def === 'undefined' || def === null) {
        return null;
    } else if (typeof def === 'string') {
        return def;
    } else if (typeof def === 'function') {
        return createElementFromData(def(), index);
    } else if (def.$$typeof && def.$$typeof.toString() === 'Symbol(react.element)') {
        return def;
    }
    def[1] = def[1] || {};
    try {
        if (!def[1].key) {
            def[1].key = 'f' + index;
        }
        if (keyPrefix && def[1].key[0] !== ':') {
            def[1].key = keyPrefix + '-' + def[1].key;
        }
    } catch (err) {
        console.log(err, def);
    }
    let children = null;
    if (def.length > 2 && typeof def[2] !== 'undefined' && def[2] !== null) {
        if (def[2]['constructor'] === Array) {
            children = def[2].map(createElementWithKey(def[1].key));
        } else {
            children = def[2];
            if (children.hasOwnProperty('toChildren')) {
                children = children.toChildren()[0];
            }
        }
    }
    if (children && children.length === 1) {
        children = children[0];
    }
    if(def[0] === 'script' && typeof children === 'string') {
        def[1].dangerouslySetInnerHTML = { __html: children };
        children = null;
    }
    return React.createElement(def[0], def[1], children);
};

const createElementWithKey = key => {
    return (def, index) => {
        return createElementFromData(def, index, key);
    };
};

module.exports = (def, index) => {
    return createElementFromData(def, index);
};