'use strict';

const client = require("../../util/cassandra");


const CassandraRefreshTokenDAO = function (constants) {

  const self = this;

  self.findByTokenWithAccessAndUser = function(token) {

  };


  return self;
};

CassandraRefreshTokenDAO.$inject = ['constants'];

module.exports = CassandraRefreshTokenDAO;