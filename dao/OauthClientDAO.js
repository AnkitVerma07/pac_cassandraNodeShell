/**
 * Created by Ankit Verma on 4/27/17.
 */
'use strict';
const OauthClientDAO = function(CassandraOauthClientDAO) {

  const self = this;

  self.getOauthClientById = CassandraOauthClientDAO.getOauthClientById;
  self.getOauthClientByClientName = CassandraOauthClientDAO.getOauthClientByClientName;
  self.insertClientData = CassandraOauthClientDAO.insertClientData;

  return self;
};

OauthClientDAO.$inject = ['cassandraOauthClientDao'];

module.exports = OauthClientDAO;