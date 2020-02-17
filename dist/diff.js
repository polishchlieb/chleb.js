"use strict";
exports.__esModule = true;
var renderNode_1 = require("./renderNode");
var setAttribute_1 = require("./setAttribute");
function diff($oldNode, old_vNode, new_vNode, $parent, unmountedParent) {
    if (unmountedParent === void 0) { unmountedParent = false; }
    if (!$oldNode && new_vNode)
        return $parent.appendChild(renderNode_1["default"](new_vNode));
    if (!new_vNode) {
        if (!unmountedParent)
            $parent.removeChild($oldNode);
        if (old_vNode.component) {
            old_vNode.component.willUnmount();
            var timer_1 = setInterval(function () {
                if (!$oldNode.parentNode) {
                    var component = old_vNode.component;
                    delete component.vPrevious;
                    delete component.$base;
                    delete component.$parent;
                    clearInterval(timer_1);
                }
            });
        }
        else if (typeof old_vNode === 'object') {
            for (var i in old_vNode.children)
                diff($oldNode.childNodes[i], old_vNode.children[i], null, $oldNode, true);
        }
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
    var attributes = Object.assign({}, old_vNode.attributes, new_vNode.attributes);
    for (var attribute in attributes) {
        if ((attribute[0] === 'o' && attribute[1] === 'n') || attribute === 'ref')
            continue;
        var newValue = new_vNode.attributes[attribute];
        var oldValue = old_vNode.attributes[attribute];
        if (attribute === 'style') {
            var changed = false;
            var data = {};
            for (var key in newValue)
                if (newValue[key] !== oldValue[key]) {
                    data[key] = newValue[key];
                    if (!changed)
                        changed = true;
                }
            if (changed)
                Object.assign($oldNode.style, data);
            continue;
        }
        if (newValue !== oldValue)
            setAttribute_1["default"]($oldNode, attribute, newValue);
    }
    for (var i in new_vNode.children) {
        diff($oldNode.childNodes[i], old_vNode.children[i], new_vNode.children[i], $oldNode);
    }
    return $oldNode;
}
exports["default"] = diff;
