var Node = require('./lib/Node.js');

class Hub extends Node {

  constructor(option){
    super(option);
    this._role = Node.ROLE_HUB;
  }

}

exports.Node = Node;
exports.Hub = Hub;