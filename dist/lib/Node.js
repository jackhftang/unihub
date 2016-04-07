'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringMap = require('../struct/StringMap');
var EmitListener = require('./EmitListener');
var TimedCallbackManager = require('./TimedCallbackManager');
var TagSet = require('../struct/TagSet');
var Tool = require('./Tool');
var Instruction = require('./Instruction');
var Packet = require('./Packet');

var Node = function () {
  function Node(option) {
    _classCallCheck(this, Node);

    var opt = Tool.objectUnion({
      id: Tool.random128(),
      role: Node.ROLE_NODE
    }, option);

    // unique name
    this._id = opt.id;

    // role
    this._role = opt.role;

    // links
    this._links = new StringMap();

    // state
    this._emitListeners = new TagSet();
    this._requestListeners = new StringMap();
    this._callbacks = new TimedCallbackManager();
  }

  _createClass(Node, [{
    key: 'emitArray',


    ///////////////////////////////////////////////////////////

    value: function emitArray(dest, event, arr) {
      var inst = Instruction.emit(event, arr);
      var pkt = Packet.data(this.id, dest, inst.toArray());
      this.send(dest, pkt);
      return this;
    }
  }, {
    key: 'emit',
    value: function emit(dest, event) {
      var args = Array.prototype.slice.call(arguments, 2);
      return this.emitArray(dest, event, args);
    }
  }, {
    key: 'on',
    value: function on(event, callback, ttl) {
      var listener = new EmitListener(callback, ttl);
      return this._emitListeners.add(listener, event);
    }
  }, {
    key: 'once',
    value: function once(event, callback) {
      return this.on(event, callback, 1);
    }
  }, {
    key: 'removeEmitListener',
    value: function removeEmitListener(id) {
      return this._emitListeners.remove(id);
    }
  }, {
    key: 'processEmit',
    value: function processEmit(src, event, data) {
      // context is to bound to this of callback
      var context = { src: src };
      this._emitListeners.forEach(event, function (listener, id) {
        listener.apply(context, data);
        listener.deductLife();
        if (!listener.isAlive()) this.removeEmitListener(id);
      });
    }

    ///////////////////////////////////////////////////////////

  }, {
    key: 'request',
    value: function request(dest, event, data, callback, ttw) {
      var cbid = this._callbacks.add(callback, ttw);
      var inst = Instruction.request(event, data, cbid);
      var pkt = Packet.data(this.id, dest, inst.toArray());
      this.send(dest, pkt);
      return this;
    }
  }, {
    key: 'reply',
    value: function reply(event, callback) {
      var b = this._requestListeners.has(event);
      if (b) throw new Error('multiple reply on ' + event);
      this._requestListeners.set(event, callback);
      return this;
    }
  }, {
    key: 'removeRequestListener',
    value: function removeRequestListener(event) {
      return this._requestListeners.del(event);
    }
  }, {
    key: 'processRequest',
    value: function processRequest(src, event, data, cbid) {
      var _this = this;

      var context = { src: src };
      var listener = this._requestListeners.get(event);
      var done = function done() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var rep = Instruction.reply(args, cbid);
        var pkt = Packet.data(_this.id, src, rep.toArray());
        _this.send(src, pkt);
      };
      if (listener) listener.call(context, data, done);else done();
    }
  }, {
    key: 'processReply',
    value: function processReply(src, data, cbid) {
      var context = { src: src };
      this._callbacks.apply(cbid, context, data);
    }

    ///////////////////////////////////////////////////////////

    // send receive an array

  }, {
    key: 'addHub',
    value: function addHub(send) {
      this._hub = send;
    }
  }, {
    key: 'addLink',
    value: function addLink(id, send) {
      this._links.set(id, send);
    }

    ///////////////////////////////////////////////////////////

    // input packet in object form
    // output packet in array form

  }, {
    key: 'send',
    value: function send(dest, pkt) {
      //console.log(this.id, 'sending to', dest, pkt);

      // send to me
      if (dest === this.id) {
        if (pkt.dest === this.id) this.feed(pkt.toArray());else this.send(pkt.dest, pkt);
        return;
      }

      // time to live
      if (pkt.age++ > Packet.MAX_AGE) return;

      if (this._role === Node.ROLE_NODE) {
        if (typeof this._hub === 'function') {
          this._hub(pkt.toArray());
        }
      } else if (this._role === Node.ROLE_HUB) {
        // forward to other nodes
        var send = this._links.get(dest);
        if (typeof send === 'function') send(pkt.toArray());
      }
    }

    // input packet in array form
    // output packet in object form

  }, {
    key: 'feed',
    value: function feed(packet) {
      //console.log(this.id, 'receive', packet);

      var pkt = Packet.fromArray(packet);
      if (pkt.dest === this.id) {
        pkt.process(this);
      } else this.send(pkt.dest, pkt);
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }]);

  return Node;
}();

Node.ROLE_NODE = 0;
Node.ROLE_HUB = 1;

module.exports = Node;