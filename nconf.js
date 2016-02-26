var nconf = require('nconf');

module.exports = function() {
  nconf.argv().env();
  const NODE_ENV = nconf.get('NODE_ENV') || 'development';
  nconf.file(`config.${NODE_ENV}.json`);
  return nconf;
};
