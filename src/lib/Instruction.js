/**
 * Instruction = (type, data)
 * type = {emit, request, reply}
 */

class Instruction {
  constructor(type, data){
    this.type = type;
    this.data = data;
  }

  static emit(event, data) {
    return new Instruction(this.TYPE_EMIT, [event, data]);
  }

  static request(event, data, cbid) {
    return new Instruction(this.TYPE_REQUEST, [event, data, cbid] );
  }

  static reply(data, cbid) {
    return new Instruction(this.TYPE_REPLY, [data, cbid]);
  }

  static fromArray(arr){
    return new Instruction(arr[0], arr[1]);
  }

  toArray(){
    return [this.type, this.data];
  }

  execute(node, src){
    try {
      if (this.type === Instruction.TYPE_EMIT) {
        let event = this.data[0];
        let data = this.data[1];
        node.processEmit(src, event, data);
      }
      else if (this.type === Instruction.TYPE_REQUEST) {
        let event = this.data[0];
        let data  = this.data[1];
        let cbid  = this.data[2];
        node.processRequest(src, event, data, cbid);
      }
      else if (this.type === Instruction.TYPE_REPLY) {
        let data = this.data[0];
        let cbid = this.data[1];
        node.processReply(src, data, cbid);
      }
      else {
        console.error('unknown type of instruction ' + this.type)
      }
    }
    catch (ex) {
      console.error(ex.stack);
    }
  }
}
Instruction.TYPE_EMIT = 0;
Instruction.TYPE_REQUEST = 1;
Instruction.TYPE_REPLY = 2;

module.exports = Instruction;