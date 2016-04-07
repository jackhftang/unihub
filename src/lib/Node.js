const StringMap = require('../struct/StringMap');
const EmitListener = require('./EmitListener');
const TimedCallbackManager = require('./TimedCallbackManager');
const TagSet = require('../struct/TagSet');
const Tool = require('./Tool');
const Instruction = require('./Instruction');
const Packet = require('./Packet');

class Node {

  constructor(option){
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

  get id(){
    return this._id;
  }

  ///////////////////////////////////////////////////////////

  emitArray(dest, event, arr){
    var inst = Instruction.emit(event, arr);
    var pkt = Packet.data(this.id, dest, inst.toArray());
    this.send(dest, pkt);
    return this
  };

  emit(dest, event){
    var args = Array.prototype.slice.call(arguments, 2);
    return this.emitArray(dest, event, args)
  };

  on(event, callback, ttl){
    var listener = new EmitListener(callback,ttl);
    return this._emitListeners.add(listener, event)
  };

  once(event, callback){
    return this.on(event, callback, 1)
  };

  removeEmitListener(id){
    return this._emitListeners.remove(id)
  };

  processEmit(src, event, data){
    // context is to bound to this of callback
    var context = { src: src };
    this._emitListeners.forEach(event, function (listener, id) {
      listener.apply(context, data);
      listener.deductLife();
      if (!listener.isAlive()) this.removeEmitListener(id)
    })
  }

  ///////////////////////////////////////////////////////////

  request(dest, event, data, callback, ttw){
    var cbid = this._callbacks.add(callback,ttw);
    var inst = Instruction.request(event,data,cbid);
    var pkt = Packet.data(this.id, dest, inst.toArray());
    this.send(dest, pkt);
    return this
  };

  reply(event, callback){
    var b = this._requestListeners.has(event);
    if(b) throw new Error('multiple reply on ' + event);
    this._requestListeners.set(event, callback);
    return this
  };

  removeRequestListener(event){
    return this._requestListeners.del(event)
  };

  processRequest(src, event, data, cbid){
    var context = { src: src };
    let listener = this._requestListeners.get(event);
    let done = (...args) => {
      var rep = Instruction.reply(args, cbid);
      var pkt = Packet.data(this.id, src, rep.toArray());
      this.send(src, pkt);
    };
    if (listener) listener.call(context, data, done);
    else done()
  }

  processReply(src, data, cbid) {
    var context = { src: src };
    this._callbacks.apply(cbid, context, data)
  }


  ///////////////////////////////////////////////////////////

  // send receive an array

  addHub(send){
    this._hub = send;
  }

  addLink(id, send){
    this._links.set(id, send);
  }

  ///////////////////////////////////////////////////////////

  // input packet in object form
  // output packet in array form
  send(dest, pkt){
    //console.log(this.id, 'sending to', dest, pkt);

    // send to me
    if( dest === this.id ){
      if( pkt.dest === this.id ) this.feed(pkt.toArray());
      else this.send(pkt.dest, pkt);
      return;
    }

    // time to live
    if( pkt.age++ > Packet.MAX_AGE ) return;

    if( this._role === Node.ROLE_NODE ){
      if( typeof this._hub === 'function' ){
        this._hub( pkt.toArray() );
      }
    }
    else if( this._role === Node.ROLE_HUB ){
      // forward to other nodes
      let send = this._links.get(dest);
      if( typeof send  === 'function' ) send(pkt.toArray());
    }
  }

  // input packet in array form
  // output packet in object form
  feed(packet){
    //console.log(this.id, 'receive', packet);

    var pkt = Packet.fromArray(packet);
    if( pkt.dest === this.id ){
      pkt.process(this);

    }
    else this.send(pkt.dest, pkt);
  }
}
Node.ROLE_NODE = 0;
Node.ROLE_HUB = 1;

module.exports = Node;