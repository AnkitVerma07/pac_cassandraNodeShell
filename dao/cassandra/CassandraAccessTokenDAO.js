'use strict';

const client = require("../../util/cassandra");


const CassandraAccessTokenDAO = function (constants) {

  const self = this;

  self.findTokenWithUserId = function(userId) {

  };

  self.findByIdWithUser = function(id, without) {

  };

  self.findByToken = function(token) {

  };

  self.saveTokenSet = function(aTokenData, rTokenData) {

  };


  return self;
};

CassandraAccessTokenDAO.$inject = ['constants'];

module.exports = CassandraAccessTokenDAO;