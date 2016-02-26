'use strict';

const Promise = require('bluebird');
const uuid = require('node-uuid');
const amqp = require('amqplib');

const nconf = require('../nconf')();

const AMQP_ADDRESS = nconf.get('amqp_address') || 'amqp://127.0.0.1';
const QUEUE_NAME = 'service_proxy';

let _conn;
let _ch;

amqp.connect(AMQP_ADDRESS)
  .then(function(conn) {
    _conn = conn;
    return conn.createChannel();
  })
  .then(function(ch) {
    _ch = ch;
    return ch.assertQueue('', {exclusive: true});
  })
  .then(function(q) {
    var corr = uuid.v4();
    var msg = 'helloworld';
    var ch = _ch;

    ch.consume(q.queue, function(msg) {
      if (msg.properties.correlationId !== corr) return;
      console.log('[*] received:', msg.content.toString());

      setTimeout(function() {
        let conn = _conn;
        conn.close();
        process.exit(0);
      }, 500);
    }, {noAck: true});

    console.log('[*] sending:', msg);
    ch.sendToQueue(QUEUE_NAME, new Buffer(msg.toString()), {
      correlationId: corr,
      replyTo: q.queue
    });
  })
  .catch(console.error.bind(console));
