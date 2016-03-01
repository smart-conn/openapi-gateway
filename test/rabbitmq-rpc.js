var assert = require('assert');
var rabbitmqRpc = require('../lib/rabbitmq-rpc');

describe('rabbit mq rpc test', function() {

  it('should be start a rpc echo server', function() {
    var rpc = rabbitmqRpc({address: 'amqp://127.0.0.1'});
    return rpc.on('echo', function(msg) {
      return msg;
    });
  })

  it('should invoke success', function() {
    var rpc = rabbitmqRpc({address: 'amqp://127.0.0.1'});
    var testMessage = 'helloworld';
    return rpc.call('echo', testMessage).then(function(msg) {
      assert(msg === testMessage, 'echo not match');
    });
  });

});
