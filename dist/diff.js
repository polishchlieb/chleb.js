"use strict";
exports.__esModule = true;
var renderNode_1 = require("./renderNode");
var setAttribute_1 = require("./setAttribute");
function diff($oldNode, old_vNode, new_vNode, $parent) {
    if (!$oldNode && new_vNode)
        return $parent.appendChild(renderNode_1["default"](new_vNode));
    if (!new_vNode) {
        $parent.removeChild($oldNode);
        return;
    }
    if (typeof old_vNode !== typeof new_vNode) {
        var $newNode = renderNode_1["default"](new_vNode);
        $parent.replaceChild($newNode, $oldNode);
        return $newNode;
    }
    // assume that old_vNode is also type of string here
    if (typeof new_vNode === 'string') {
        if (old_vNode !== new_vNode)
            $oldNode.nodeValue = new_vNode;
        return $oldNode;
    }
    // previous condition returns, so we can have some kind of assumption
    old_vNode = old_vNode;
    if (new_vNode.type !== old_vNode.type) {
        console.log(new_vNode);
        console.log(new_vNode.type);
        console.log(old_vNode.type);
        var $newNode = renderNode_1["default"](new_vNode);
        $parent.replaceChild($newNode, $oldNode);
        return $newNode;
    }
    if (typeof new_vNode.type === 'function') {
        new_vNode.component = old_vNode.component;
        var component = new_vNode.component;
        component.props = new_vNode.attributes;
        var rendered = component.render();
        return diff($oldNode, component.vPrevious, rendered, $parent);
    }
    var attributes = Object.assign(old_vNode.attributes, new_vNode.attributes);
    for (var attribute in attributes) {
        if (attribute[0] === 'o' && attribute[1] === 'n')
            continue;
        if (attribute === 'ref')
            continue;
        var value = attributes[attribute];
        if (value !== old_vNode.attributes)
            setAttribute_1["default"]($oldNode, attribute, value);
    }
    for (var i in new_vNode.children) {
        diff($oldNode.childNodes[i], old_vNode.children[i], new_vNode.children[i], $oldNode);
    }
    return $oldNode;
}
exports["default"] = diff;
