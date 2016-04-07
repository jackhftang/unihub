"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Instruction = require("./Instruction");

var Packet = function () {
  function Packet(type, src, dest, data, age) {
    _classCallCheck(this, Packet);

    this.type = type;
    this.src = src;
    this.dest = dest;
    this.data = data; // should be instruction
    this.age = age || 0;
  }

  _createClass(Packet, [{
    key: "toArray",
    value: function toArray() {
      return [this.type, this.src, this.dest, this.data, this.age];
    }
  }, {
    key: "process",
    value: function process(node) {
      if (this.type === Packet.TYPE_DATA) {
        var inst = Instruction.fromArray(this.data);
        inst.execute(node, this.src);
      } else console.error('unknow type of packet', this.type);
    }
  }], [{
    key: "data",
    value: function data(src, dest, _data) {
      return new Packet(Packet.TYPE_DATA, src, dest, _data, 0);
    }
  }, {
    key: "fromArray",
    value: function fromArray(arr) {
      return new Packet(arr[0], arr[1], arr[2], arr[3], arr[4]);
    }
  }]);

  return Packet;
}();

Packet.MAX_AGE = 32;

Packet.TYPE_DATA = 0;
Packet.TYPE_HELLO = 1;
Packet.TYPE_UNREACHABLE = 2;

module.exports = Packet;