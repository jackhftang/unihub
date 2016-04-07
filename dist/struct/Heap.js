"use strict";

var Heap = function () {
    function Heap(cmp, arr) {
        this._arr = arr || [];
        this._cmp = cmp || function (a, b) {
            return a < b;
        };
        this.heapify();
    }
    Object.defineProperty(Heap.prototype, "length", {
        get: function get() {
            return this._arr.length;
        },
        enumerable: true,
        configurable: true
    });
    Heap.prototype.isEmpty = function () {
        return this._arr.length === 0;
    };
    Heap.prototype.take = function () {
        var arr = this._arr;
        if (arr.length === 0) throw new Error('empty heap');else if (arr.length === 1) return arr.pop();else {
            var x = arr[0];
            arr[0] = arr.pop();
            this.heapDown(0);
            return x;
        }
    };
    Heap.prototype.add = function (x) {
        this._arr.push(x);
        this.heapUp(this.length - 1);
        return this;
    };
    Heap.prototype.peek = function () {
        return this._arr[0];
    };
    Heap.prototype.heapUp = function (i) {
        if (i === 0) return;
        var p = Math.floor((i - 1) / 2);
        var arr = this._arr;
        var cmp = this._cmp;
        if (cmp(arr[i], arr[p])) {
            var t = arr[i];
            arr[i] = arr[p];
            arr[p] = t;
            this.heapUp(p);
        }
    };
    Heap.prototype.heapDown = function (i) {
        var arr = this._arr;
        var cmp = this._cmp;
        var min = function min(a, b) {
            if (b >= arr.length || cmp(arr[a], arr[b])) return a;
            return b;
        };
        var l = 2 * i + 1;
        var r = 2 * i + 2;
        var m = min(i, min(l, r));
        if (m !== i) {
            var t = arr[i];
            arr[i] = arr[m];
            arr[m] = t;
            this.heapDown(m);
        }
    };
    Heap.prototype.heapify = function () {
        var len = this.length;
        if (len === 0) return;
        var s = Math.floor((len - 1) / 2);
        for (var i = s; i >= 0; i--) {
            this.heapDown(i);
        }
    };
    Heap.prototype.clear = function () {
        if (this._arr.length !== 0) this._arr = [];
    };
    // O(n)
    Heap.prototype.removeAny = function (pred) {
        var i = 0;
        var arr = this._arr;
        while (i < arr.length) {
            var x = arr[i];
            if (pred(x)) {
                if (i === arr.length - 1) arr.pop();else {
                    arr[i] = arr.pop();
                    this.heapDown(i);
                }
                return x;
            } else i++;
        }
        return null;
    };
    // O(n)
    Heap.prototype.removeAll = function (pred) {
        var i = 0;
        var cnt = 0;
        var arr = this._arr;
        while (i < arr.length) {
            var x = arr[i];
            if (pred(x)) {
                if (i === arr.length - 1) arr.pop();else {
                    arr[i] = arr.pop();
                    this.heapDown(i);
                }
                cnt++;
            } else i++;
        }
        return cnt;
    };
    return Heap;
}();
module.exports = Heap;