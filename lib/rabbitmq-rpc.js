'use strict';

const Promise = require('bluebird');
const amqp = require('amqplib');
const uuid = require('node-uuid');

function RPC(options) {
  Object.assign(this, options);
}

RPC.prototype.getConnection = function() {
  if (!this.connection) {
    this.connection = amqp.connect(this.address);
  }
  return this.connection;
};

RPC.prototype.getChannel = Promise.coroutine(function*() {
  let conn = yield this.getConnection();
  if (!this.channel) {
    this.channel = conn.createChannel();
  }
  return this.channel;
});

RPC.prototype.registerReply = function(ch, corr, callback) {
  return ch
    .assertQueue('', {exclusive: true})
    .then((replyQueue) => {
      ch.consume(replyQueue.queue, (msg) => {
        if (msg.properties.correlationId === corr) {
          callback(msg.content.toString());
          ch.cancel(msg.fields.consumerTag);
        }
      }, {noAck: true});
      return replyQueue.queue;
    });
};

RPC.prototype.on = Promise.coroutine(function*(queueName, callback) {
  let ch = yield this.getChannel();

  ch.assertQueue(queueName, {durable: false});
  ch.prefetch(1);

  ch.consume(queueName, (msg) => {
    Promise
      .resolve(callback(msg.content.toString()))
      .then(function(result) {
        ch.sendToQueue(msg.properties.replyTo, new Buffer(result.toString()), {
          correlationId: msg.properties.correlationId
        });
      });
    ch.ack(msg);
  });

});

RPC.prototype.call = Promise.coroutine(function*(queueName, msg) {
  let ch = yield this.getChannel();
  let corr = uuid.v4();

  return yield new Promise((resolve, reject) => {
    this.registerReply(ch, corr, (reply) => {
      resolve(reply);
    }).then((replyQueueName) => {
      ch.sendToQueue(queueName, new Buffer(msg.toString()), {
        correlationId: corr,
        replyTo: replyQueueName
      });
    });
  });
});

function rpcFactory(options) {
  return new RPC(options);
}

module.exports = rpcFactory;
