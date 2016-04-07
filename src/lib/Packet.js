const Instruction = require("./Instruction");

class Packet {

  constructor(type, src, dest, data, age) {
    this.type = type;
    this.src = src;
    this.dest = dest;
    this.data = data;       // should be instruction
    this.age = age || 0
  }

  static data(src, dest, data){
    return new Packet(Packet.TYPE_DATA, src, dest, data, 0);
  }

  static fromArray(arr){
    return new Packet(arr[0], arr[1],arr[2], arr[3], arr[4]);
  }

  toArray(){
    return [this.type, this.src, this.dest, this.data, this.age]
  }

  process(node){
    if( this.type === Packet.TYPE_DATA ){
      var inst = Instruction.fromArray(this.data);
      inst.execute(node, this.src);
    }
    else console.error('unknow type of packet', this.type);
  }

}
Packet.MAX_AGE = 32;

Packet.TYPE_DATA = 0;
Packet.TYPE_HELLO = 1;
Packet.TYPE_UNREACHABLE = 2;

module.exports = Packet;