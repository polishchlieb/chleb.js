"use strict";
exports.__esModule = true;
var diff_1 = require("./diff");
var Component = /** @class */ (function () {
    function Component() {
        this.state = {};
        this.props = {};
    }
    Component.prototype.willMount = function () { };
    Component.prototype.mounted = function () { };
    Component.prototype.render = function () {
        throw new Error('render method not implemented');
    };
    Component.prototype.setState = function (state) {
        Object.assign(this.state, state);
        this.renderComponent();
    };
    Component.prototype.renderComponent = function () {
        var vNode = this.render();
        this.$base = diff_1["default"](this.$base, this.vPrevious, vNode, this.$parent);
    };
    return Component;
}());
exports["default"] = Component;
