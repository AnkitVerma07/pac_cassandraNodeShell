/**
 * Created by Ankit Verma on 4/27/17.
 */
'use strict';
const RefreshTokenDAO = function(CassandraRefreshTokenDAO) {

  const self = this;

  self.findByTokenWithAccessAndUser = CassandraRefreshTokenDAO.findByTokenWithAccessAndUser;

  return self;
};

RefreshTokenDAO.$inject = ['cassandraRefreshTokenDao'];

module.exports = RefreshTokenDAO;