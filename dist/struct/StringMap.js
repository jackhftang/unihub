'use strict';

var StringMap = function () {
    function StringMap() {
        this._map = {};
    }
    StringMap.prototype.get = function (key) {
        var k = key.toString();
        return this._map[k];
    };
    StringMap.prototype.set = function (key, val) {
        var k = key.toString();
        this._map[k] = val;
        return this;
    };
    StringMap.prototype.setnx = function (key, val) {
        var k = key.toString();
        var v = this._map[k];
        if (typeof v === 'undefined') this._map[k] = val;
        return this;
    };
    StringMap.prototype.modify = function (key, val, f) {
        var k = key.toString();
        var v = this._map[k];
        return this._map[k] = f(v, val);
    };
    StringMap.prototype.getset = function (key, val) {
        var k = key.toString();
        var t = this._map[k];
        this._map[k] = val;
        return t;
    };
    StringMap.prototype.getdel = function (key) {
        var k = key.toString();
        var t = this._map[k];
        delete this._map[k];
        return t;
    };
    // avoid to use keyword delete
    StringMap.prototype.del = function (key) {
        var k = key.toString();
        var t = this._map[k];
        delete this._map[k];
        return t;
    };
    StringMap.prototype.keys = function () {
        return Object.keys(this._map);
    };
    StringMap.prototype.vals = function () {
        var ks = Object.keys(this._map);
        var arr = new Array(ks.length);
        for (var i = ks.length; i--;) {
            arr[i] = this._map[ks[i]];
        }return arr;
    };
    StringMap.prototype.has = function (key) {
        var k = key.toString();
        return k in this._map;
    };
    StringMap.prototype.getAll = function () {
        var arr = [];
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            arr.push(k);
            arr.push(this._map[k]);
        }
        return arr;
    };
    StringMap.prototype.forEach = function (callback) {
        var ks = this.keys();
        for (var i = ks.length; i--;) {
            var k = ks[i];
            var v = this.get(k);
            callback.call(null, k, v);
        }
    };
    return StringMap;
}();
module.exports = StringMap;