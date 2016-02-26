'use strict';

const Promise = require('bluebird');
const amqp = require('amqplib');
const uuid = require('node-uuid');

const nconf = require('./nconf')();
const proxy = require('./lib/proxy');
const buildRequestMessage = require('./lib/build-request-message');
const buildResponseMessage = require('./lib/build-response-message');

const AMQP_ADDRESS = nconf.get('amqp_address') || 'amqp://127.0.0.1';
const PORT = nconf.get('port') || 3000;
const QUEUE_NAME = 'service_proxy';

console.log('connecting to rabbitmq ...');
amqp.connect(AMQP_ADDRESS)
  .then(function(conn) {
    console.log('creating channel ...');
    return conn.createChannel();
  })
  .then(function(ch) {
    ch.assertQueue(QUEUE_NAME, {durable: false});
    ch.prefetch(1);

    console.log('waiting request ...');
    ch.consume(QUEUE_NAME, function(msg) {
      console.log('[x] receiving:', msg.content.toString());

      let options = buildRequestMessage(msg.toString());
      proxy(options)
        .then(function(result) {
          let response = buildResponseMessage(result);
          ch.sendToQueue(msg.properties.replyTo, new Buffer(response), {
            correlationId: msg.properties.correlationId
          });
        })
        .catch(function(err) {
          ch.sendToQueue(msg.properties.replyTo, new Buffer(err.toString()), {
            correlationId: msg.properties.correlationId
          });
        });

      ch.ack(msg);
    });
  })
  .catch(console.error.bind(console));
