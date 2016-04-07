"use strict";

/**
 * EmitListener
 * @constructor
 * @param {Function} callback
 * @param {number}   ttl
 */
function EmitListener(callback, ttl) {
  this._ttl = ttl || -1; // -1 means forever
  this._callback = callback || function () {};
}

EmitListener.prototype.deductLife = function () {
  if (this._ttl > 0) this._ttl -= 1;
};

EmitListener.prototype.isAlive = function () {
  return this._ttl !== 0;
};

// data is an array
EmitListener.prototype.apply = function (context, arr) {
  return this._callback.apply(context, arr);
};

EmitListener.prototype.call = function (context) {
  var args = new Array(arguments.length);
  for (var i = 1; i < arguments.length; i++) {
    args[i] = arguments[i];
  }return this._callback.apply(context, args);
};
module.exports = EmitListener;