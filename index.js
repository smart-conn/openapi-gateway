const nconf = require('./nconf')();
const DeviceForwardProxy = require('./src/device-forward-proxy');
const deviceReverseProxy = require('./src/device-reverse-proxy');
const ServiceRegistry = require('./src/service-registry');

const BROKER_ADDRESS = nconf.get('broker_address') || 'amqp://127.0.0.1';
const PROXY_PORT = nconf.get('port') || 3000;
const REGISTRY_PORT = nconf.get('registry_port') || 3001;

let reverseProxy = deviceReverseProxy({
  port: PROXY_PORT,
  brokerAddress: BROKER_ADDRESS
});

let forwardProxy = new DeviceForwardProxy({
  brokerAddress: BROKER_ADDRESS
});

let serviceRegistry = new ServiceRegistry({
  port: REGISTRY_PORT
});

Promise.all([
  reverseProxy.start();
  forwardProxy.start();
  serviceRegistry.start();
]).then(() => {
  console.log('all serivce online');
});
