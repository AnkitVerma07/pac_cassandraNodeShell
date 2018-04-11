/**
 * Created by Ankit Verma on 5/18/16.
 */
'use strict';
const Service = function(RefreshTokenDAO) {

  const self = this;

  self.findByTokenWithAccessAndUser = RefreshTokenDAO.findByTokenWithAccessAndUser;

  return self;
};

Service.$inject = ['refreshTokenDao'];

module.exports = Service;