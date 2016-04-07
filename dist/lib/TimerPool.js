'use strict';

var Heap_1 = require('../struct/Heap');
var TimerPool = function () {
    function TimerPool(option) {
        var opt = {
            clearingInterval: 100
        };
        if (option && option.clearingInterval) opt.clearingInterval = option.clearingInterval;
        this._clearingInterval = opt.clearingInterval;
        this._cnt = 0;
        this._pool = new Heap_1(function (a, b) {
            return a.time < b.time;
        });
        this._timer = null;
        this.start();
    }
    TimerPool.prototype.start = function () {
        var _this = this;
        var h = this._pool;
        var run = function run() {
            var now = Date.now();
            while (!h.isEmpty() && h.peek().time <= now) {
                var t = h.take();
                if (t.type === 'interval') {
                    t.time += t.interval;
                    h.add(t);
                }
                // hope to use setImmediate, but for compatibility
                t.action.call();
            }
            _this._timer = setTimeout(run, _this._clearingInterval);
        };
        run();
    };
    // not stop immediately, unit current round of timeout
    TimerPool.prototype.pause = function () {
        if (this._timer) clearTimeout(this._timer);
        this._timer = null;
    };
    TimerPool.prototype.setTimeout = function (f, ms) {
        var now = Date.now();
        var id = '_' + this._cnt++;
        this._pool.add({
            id: id,
            type: 'timeout',
            time: now + ms,
            action: f
        });
        return id;
    };
    TimerPool.prototype.setInterval = function (f, ms) {
        var now = Date.now();
        var id = '_' + this._cnt++;
        this._pool.add({
            id: id,
            type: 'interval',
            interval: ms,
            time: now + ms,
            action: f
        });
        return id;
    };
    // O(n)
    TimerPool.prototype.clearTimer = function (id) {
        var t = this._pool.removeAny(function (x) {
            return x.id === id;
        });
        return !!t;
    };
    TimerPool.global = new TimerPool();
    return TimerPool;
}();
module.exports = TimerPool;