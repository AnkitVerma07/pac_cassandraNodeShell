
'use strict';
const path = require('path');
const camelCase = require('camelcase');
const decamelize = require('decamelize');
const intravenous = require('intravenous');

const IoC = function(app) {

  const self = this;

  const appRoot = __dirname;

  const enumerateFiles = function(folder, eachFile) {
    let normalizedPath = path.join(appRoot, folder);

    require("fs").readdirSync(normalizedPath).forEach(function(filename) {
      eachFile(filename);
    });
  };

  const enumerateFilesCamelCase = function(folder, eachFile) {
    enumerateFiles(folder, function(filename) {
      let filenameExtension = path.extname(filename);
      if (filenameExtension == ".js") {
        let filenameNoExtension = path.basename(filename, filenameExtension);
        // we decamelize and camelCase here to ensure a camelcased result
        let filenameCamelCase = camelCase(decamelize(filenameNoExtension));

        //if(filenameNoExtension == 'DJService'){
        //	filenameCamelCase = 'djService';
        //}

        eachFile(filenameNoExtension, filenameCamelCase);
      }
    });
  };

  const registerFolderAsSingleton = function(folder, container) {
    enumerateFilesCamelCase(folder, function(filenameNoExtension, filenameCamelCase) {
      let required = require('./' + folder + '/' + filenameNoExtension);
      container.register(filenameCamelCase, required, 'singleton');
    });
  };

  self.configure = function() {
    if (!self._initComplete) {
      self._initComplete = true;

      const container = intravenous.create();

      container.register('config', require(path.join(appRoot, 'config/app_configs', 'config.json')));

      container.register('app', app, 'singleton');

      registerFolderAsSingleton('services', container);
      registerFolderAsSingleton('dao', container);
      registerFolderAsSingleton('dao/cassandra', container);
      registerFolderAsSingleton('rpc', container);
      registerFolderAsSingleton('middleware', container);
      registerFolderAsSingleton('routes', container);
      registerFolderAsSingleton('util', container);
      registerFolderAsSingleton('oauth', container);
      registerFolderAsSingleton('oauth/utils', container);

      self._container = container;
    }
  };

  self.get = function(name) {
    return self._container.get(name);
  };

  return self;
};

module.exports = IoC;