"use strict";
exports.__esModule = true;
function setAttribute($node, name, value) {
    if (name === 'className')
        name = 'class';
    $node.setAttribute(name, value);
}
exports["default"] = setAttribute;
