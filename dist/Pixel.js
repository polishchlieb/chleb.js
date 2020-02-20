"use strict";
exports.__esModule = true;
var diff_1 = require("./diff");
var Pixel = /** @class */ (function () {
    function Pixel() {
    }
    Pixel.parse = function (type, attributes) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        return {
            type: type,
            attributes: attributes || {},
            children: children.flat(Infinity)
        };
    };
    Pixel.render = function (vNode, $parent) {
        diff_1["default"](null, null, vNode, $parent);
    };
    Pixel.createRef = function () {
        return { current: null };
    };
    return Pixel;
}());
exports["default"] = Pixel;
