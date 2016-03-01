'use strict';

const amqp = require('amqplib');

const rabbitmqRpc = require('../lib/rabbitmq-rpc');
const MessageCall = require('../lib/messages/message-call');
const httpProxy = require('../lib/http-proxy');

class DeviceForwardProxy {

  constructor(options) {
    Object.assign(this, options);
  }

  onCall(msg) {
    MessageCall.fromAllJoynXMLAsync(msg)
      .then(function(messageCall) {
        return httpProxy(messageCall.toRequestOptions())
      })
      .then((result) => {
        let messageReturn = MessageReturn.fromHttpBody(result);
        return messageReturn.toAllJoynXML();
      });
  }

  start() {
    console.log('connecting to rabbitmq ...');
    let rpc = this.rpc = rabbitmqRpc({address: this.brokerAddress});
    rpc.on('service_proxy', this.onCall.bind(this));
  }

}

module.exports = DeviceForwardProxy;
