var TimerPool_1 = require('./TimerPool');
var timerPool = TimerPool_1.global;
var MinTimeToWait = 20;
var DefaultTimeToWait = 5 * 1000;
var TimedCallback = (function () {
    function TimedCallback(callback, ttw, timeoutCallback) {
        this._timer = null;
        this._ttw = Math.max(ttw || DefaultTimeToWait, MinTimeToWait);
        this._callback = callback;
        this._timeoutCallback = timeoutCallback;
    }
    TimedCallback.prototype.call = function (context) {
        var arr = Array.prototype.slice.call(arguments, 1);
        return this.apply(context, arr);
    };
    TimedCallback.prototype.apply = function (context, arr) {
        var cb = this._callback;
        this._callback = null;
        this._timeoutCallback = null;
        if (typeof cb === 'function')
            return cb.apply(context, arr);
    };
    TimedCallback.prototype.start = function (context) {
        var _this = this;
        var start = Date.now();
        this._timer = timerPool.setTimeout(function () {
            _this._callback = null;
            if (_this._timeoutCallback) {
                var end = Date.now();
                _this._timeoutCallback.call(context, end - start);
            }
        }, this._ttw);
    };
    TimedCallback.prototype.isStarted = function () {
        return !!this._timer;
    };
    return TimedCallback;
})();
module.exports = TimedCallback;
