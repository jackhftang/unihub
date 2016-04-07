var StringSet = (function () {
    function StringSet() {
        this.cnt = 0;
        this._bag = {};
    }
    StringSet.singleton = function (str) {
        var s = new StringSet();
        s.add(str);
        return s;
    };
    StringSet.fromArray = function (arr) {
        var s = new StringSet();
        for (var i = 0; i < arr.legnth; i++) {
            s.add(arr[i]);
        }
        return s;
    };
    Object.defineProperty(StringSet.prototype, "cardinal", {
        get: function () {
            return this.cnt;
        },
        enumerable: true,
        configurable: true
    });
    StringSet.prototype.add = function (str) {
        str = str.toString();
        var t = this._bag[str];
        if (!t) {
            this._bag[str] = true;
            this.cnt += 1;
        }
        return this;
    };
    StringSet.prototype.remove = function (str) {
        var t = this._bag[str];
        if (t) {
            delete this._bag[str];
            this.cnt -= 1;
            return t;
        }
        return null;
    };
    StringSet.prototype.isMember = function (str) {
        return str in this._bag;
    };
    StringSet.prototype.members = function () {
        return Object.keys(this._bag);
    };
    StringSet.prototype.forEach = function (callback) {
        var xs = Object.keys(this._bag);
        for (var i = 0; i < xs.length; i++)
            callback(xs[i]);
    };
    StringSet.prototype.toArray = function () {
        return Object.keys(this._bag);
    };
    return StringSet;
})();
module.exports = StringSet;
