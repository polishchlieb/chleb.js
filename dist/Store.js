"use strict";
exports.__esModule = true;
var Store = /** @class */ (function () {
    function Store(defaultState) {
        if (defaultState === void 0) { defaultState = {}; }
        this.listeners = [];
        this.state = defaultState;
    }
    Store.prototype.setState = function (state) {
        Object.assign(this.state, state);
        this.listeners.forEach(function (func) { return func(); });
    };
    Store.prototype.subscribe = function (func) {
        this.listeners.push(func);
    };
    return Store;
}());
exports["default"] = Store;
