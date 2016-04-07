var TimedCallback = require('./TimedCallback.js');
var StringMap = require('../struct/StringMap.js');

function TimedCallbackManager(){
  this.cnt = 0;
  this._callbacks = new StringMap()
}

// first argument of callback assumed to be error
TimedCallbackManager.prototype.add = function(callback, ttw){
  var self = this;
  var id = '_' + this.cnt++;
  var cb = new TimedCallback(callback, ttw, function(wait){
    self._callbacks.del(id);
    if(callback) callback.call(null, wait); // timeout is call in global context
  });
  this._callbacks.set(id, cb);
  cb.start();
  return id 
};

TimedCallbackManager.prototype.call = function(cbid, context){
  var cb = this._callbacks.getdel(cbid);
  if(cb){
    var arr = Array.prototype.slice.call(arguments, 2);
    cb.apply(context, arr)
  }
};

TimedCallbackManager.prototype.apply = function(cbid, context, arr){
  var cb = this._callbacks.getdel(cbid);
  if(cb) cb.apply(context, arr)
};

module.exports = TimedCallbackManager;