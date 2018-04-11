/**
 * Created by Ankit Verma on 4/14/17.
 */
'use strict';
const Promise = require('bluebird');

const errors = require('../models/error');


const Service = function(OauthClientDAO) {

  const self = this;


  self.findByClientId = async(id) => {
    return await OauthClientDAO.getOauthClientById(id);
  };

  self.findByClientName = async(clientId) => {
    return await OauthClientDAO.getOauthClientByClientName(clientId);
  };

  self.createOauthClient = async(clientData) => {
    return await OauthClientDAO.insertClientData(clientData);
  };

  return self;
};

Service.$inject = [
  'oauthClientDao'
];

module.exports = Service;