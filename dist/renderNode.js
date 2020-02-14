"use strict";
exports.__esModule = true;
var setAttribute_1 = require("./setAttribute");
function renderNode(vNode, component) {
    if (typeof vNode === 'string')
        return document.createTextNode(vNode);
    if (typeof vNode.type === 'function') {
        var instance_1 = new vNode.type();
        instance_1.props = vNode.attributes;
        var rendered = instance_1.render();
        vNode.component = instance_1;
        instance_1.vPrevious = rendered;
        var $node_1 = renderNode(rendered, instance_1);
        instance_1.$base = $node_1;
        var timer_1 = setInterval(function () {
            if ($node_1.parentNode) {
                instance_1.mounted();
                instance_1.$parent = $node_1.parentNode;
                clearInterval(timer_1);
            }
        });
        return $node_1;
    }
    var $node = document.createElement(vNode.type);
    var children = vNode.children, attributes = vNode.attributes;
    for (var attribute in attributes) {
        if (attribute[0] === 'o' && attribute[1] === 'n')
            component && $node.addEventListener(attribute.substring(2), attributes[attribute].bind(component));
        else if (attribute === 'ref')
            attributes[attribute].current = $node;
        else
            setAttribute_1["default"]($node, attribute, attributes[attribute]);
    }
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        $node.appendChild(renderNode(child, component));
    }
    return $node;
}
exports["default"] = renderNode;
