/**
 * Created by Ankit Verma on 4/27/17.
 */
'use strict';
const AccessTokenDAO = function(CassandraAccessTokenDAO) {

  const self = this;

  self.findTokenWithUserId = CassandraAccessTokenDAO.findTokenWithUserId;
  self.findByIdWithUser = CassandraAccessTokenDAO.findByIdWithUser;
  self.findByToken = CassandraAccessTokenDAO.findByToken;
  self.saveTokenSet = CassandraAccessTokenDAO.saveTokenSet;

  return self;
};

AccessTokenDAO.$inject = ['cassandraAccessTokenDao'];

module.exports = AccessTokenDAO;