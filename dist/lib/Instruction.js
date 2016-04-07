'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Instruction = (type, data)
 * type = {emit, request, reply}
 */

var Instruction = function () {
  function Instruction(type, data) {
    _classCallCheck(this, Instruction);

    this.type = type;
    this.data = data;
  }

  _createClass(Instruction, [{
    key: 'toArray',
    value: function toArray() {
      return [this.type, this.data];
    }
  }, {
    key: 'execute',
    value: function execute(node, src) {
      try {
        if (this.type === Instruction.TYPE_EMIT) {
          var event = this.data[0];
          var data = this.data[1];
          node.processEmit(src, event, data);
        } else if (this.type === Instruction.TYPE_REQUEST) {
          var _event = this.data[0];
          var _data = this.data[1];
          var cbid = this.data[2];
          node.processRequest(src, _event, _data, cbid);
        } else if (this.type === Instruction.TYPE_REPLY) {
          var _data2 = this.data[0];
          var _cbid = this.data[1];
          node.processReply(src, _data2, _cbid);
        } else {
          console.error('unknown type of instruction ' + this.type);
        }
      } catch (ex) {
        console.error(ex.stack);
      }
    }
  }], [{
    key: 'emit',
    value: function emit(event, data) {
      return new Instruction(this.TYPE_EMIT, [event, data]);
    }
  }, {
    key: 'request',
    value: function request(event, data, cbid) {
      return new Instruction(this.TYPE_REQUEST, [event, data, cbid]);
    }
  }, {
    key: 'reply',
    value: function reply(data, cbid) {
      return new Instruction(this.TYPE_REPLY, [data, cbid]);
    }
  }, {
    key: 'fromArray',
    value: function fromArray(arr) {
      return new Instruction(arr[0], arr[1]);
    }
  }]);

  return Instruction;
}();

Instruction.TYPE_EMIT = 0;
Instruction.TYPE_REQUEST = 1;
Instruction.TYPE_REPLY = 2;

module.exports = Instruction;