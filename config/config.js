
'use strict';
const nconf = require('nconf');

const configFileName = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase().trim() + '-config.json' : 'config.json';

const pathToConfig = __dirname + '/app_configs/' + configFileName;

nconf.argv()
  .env()
  .file({
    file: pathToConfig
  });

module.exports = nconf;