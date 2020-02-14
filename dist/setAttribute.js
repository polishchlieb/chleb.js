"use strict";
exports.__esModule = true;
function setAttribute($node, name, value) {
    if (name === 'className')
        name = 'class';
    else if (name === 'style')
        return Object.assign($node.style, value);
    $node.setAttribute(name, value);
}
exports["default"] = setAttribute;
