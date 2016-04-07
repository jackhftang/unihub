var assert = require('assert');
var uni = require('../dist/index.js');
var Node = uni.Node;
var Hub = uni.Hub;

describe('Node', function(){
  var h, a, b, c;

  before(function(){
    h = new Hub({
      id: 'h'
    });

    a = new Node({
      id: 'a'
    });

    b = new Node({
      id: 'b'
    });

    c = new Node({
      id: 'c'
    });

    h.addLink(a.id, a.feed.bind(a));
    h.addLink(b.id, b.feed.bind(b));
    h.addLink(c.id, c.feed.bind(c));
    a.addHub(h.feed.bind(h));
    b.addHub(h.feed.bind(h));
    c.addHub(h.feed.bind(h));

  });

  describe('emit', function(){

    it('test 1: a to b', function(done){
      var event = 'event';
      b.on(event, function(a,b){
        assert(a === 1);
        assert(b === 2);
        done();
      });
      a.emit(b.id, event, 1, 2);
    });

    it('test 2: a to hub', function(done){
      var event = 'abc';
      h.on(event, function(a,b){
        assert(a === 1);
        assert(b === 2);
        done();
      });
      a.emit(h.id, event, 1, 2);
    });

  });

  describe('request/reply', function(done){

    it('test 1: a to b', function(done){
      var e = '123';
      b.reply(e, function(data, reply){
        reply(null, data + 1);
      });
      a.request(b.id, e, 1, function(err, res){
        assert(res === 2);
        done();
      })

    });

    it('test 2: a to h', function(done){
      var event = 'abc';
      h.reply(event, function(data, rep){
        rep(null, data+1);
      });
      a.request(h.id, event, 1, function(err, res){
        assert(res === 2);
        done();
      });
    });

  })


});