'use strict';

const REQUEST_QUEUE = 'device_reverse_proxy';

module.exports = function(rpc, msg) {
  return rpc.call(REQUEST_QUEUE, msg);
};
