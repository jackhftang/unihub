# UniHub

## usage

    var Node = require('unihub').Node;
    var Hub  = require('unihub').Hub;

    h = new Hub({
      id: 'h'
    });
    
    a = new Node({
      id: 'a'
    });
    
    b = new Node({
      id: 'b'
    });
    
    h.addLink(a.id, a.feed.bind(a));
    h.addLink(b.id, b.feed.bind(b));
    
    a.addHub(h.feed.bind(h));
    b.addHub(h.feed.bind(h));
          