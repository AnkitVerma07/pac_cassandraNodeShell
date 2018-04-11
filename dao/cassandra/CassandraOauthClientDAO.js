'use strict';

const client = require("../../util/cassandra");


const CassandraOauthClientDAO = function (constants) {

  const self = this;

  self.getOauthClientById = (id) => {

  };

  self.insertClientData = (data) => {

  };

  self.getOauthClientByClientName = (client_id) => {

  };


  return self;
};

CassandraOauthClientDAO.$inject = ['constants'];

module.exports = CassandraOauthClientDAO;