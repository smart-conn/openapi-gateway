'use strict';

const express = require('express');

class ServiceRegistry {

  constructor(options) {
    Object.assign(this, options);
  }

  onRequest(req, res) {
  }

  start() {
    this.app = express();
    app.post('/device/proxy', this.onRequest.bind(this));
    return new Promise((resolve, reject) => {
      app.listen(this.port, () => {
        console.log('service registry started at', this.port);
        resolve();
      });
    });
  }

}

module.exports = ServiceRegistry;
