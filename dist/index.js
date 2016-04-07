'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = require('./lib/Node.js');

var Hub = function (_Node) {
  _inherits(Hub, _Node);

  function Hub(option) {
    _classCallCheck(this, Hub);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Hub).call(this, option));

    _this._role = Node.ROLE_HUB;
    return _this;
  }

  return Hub;
}(Node);

exports.Node = Node;
exports.Hub = Hub;