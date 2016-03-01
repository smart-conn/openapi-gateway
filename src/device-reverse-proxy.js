'use strict';

const express = require('express');

const rabbitmqRpc = require('../lib/rabbitqm-rpc');

class DeviceReverseProxy {

  constructor(options) {
    Object.assign(this, options);
  }

  onCall(req, res) {
    getParameters(req)
      .then(function() {
        return this.rpc.call('device_reverse_proxy', JSON.stringify(parameters))
      })
      .then(function(reply) {
        return MessageReturn.fromAllJoynXMLAsync(reply);
      })
      .then(function(messageReturn) {
        res.json(messageReturn.toJSON());
      });
  }

  start() {
    this.app = express();
    this.rpc = rabbitmqRpc({address: this.brokerAddress});
    app.post('/device/proxy', this.onCall.bind(this));
    app.listen(this.port, () => {
      console.log(`device reverse proxy started at ${this.port}`);
    });
  }

}

function deviceReverseProxyFactory(options) {
  return new DeviceReverseProxy(options);
}

module.exports = DeviceReverseProxyFactory;
