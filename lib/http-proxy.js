'use strict';

const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const request = Promise.promisify(require('request'), {multiArgs: true});

module.exports = Promise.coroutine(function*(options) {
  let startTime = Date.now();
  console.log('[x] requesting:', options.uri);
  let result = yield request(options);

  console.log('[x] complete in:', Date.now() - startTime);
  let response = result[0];
  let body = result[1];
  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(body);
  }
  return body;
});
