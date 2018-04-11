/**
 * Created by Ankit Verma
 */
'use strict';
const Promise = require('bluebird');
const Service = function(AccessTokenDAO) {
  const self = this;

  self.findTokenWithUserId = AccessTokenDAO.findTokenWithUserId;
  self.findByIdWithUser = AccessTokenDAO.findByIdWithUser;
  self.findByToken = AccessTokenDAO.findByToken;

  // Methods with custom business logic before interfacing with database
  self.saveTokenSet = function(aTokenData, rTokenData) {

    // Validate that our token objects exist and have all the data we are looking for aka. Sanitize/normalize
    let sanAccessToken = _sanitizeAccessToken(aTokenData);
    let sanRefreshToken = _sanitizeRefreshToken(rTokenData);

    return AccessTokenDAO.saveTokenSet(sanAccessToken, sanRefreshToken);
  };

  function _sanitizeAccessToken(aTokenData) {
    if (!aTokenData ||
      !aTokenData.token ||
      !aTokenData.userId ||
      !aTokenData.clientId ||
      !aTokenData.dateExpired) {
      return new Promise.reject('Missing parameters in access token');
    }

    return {
      token: aTokenData.token,
      userId: aTokenData.userId,
      clientId: aTokenData.clientId,
      dateExpired: aTokenData.dateExpired,
    };
  }

  function _sanitizeRefreshToken(rTokenData) {
    if (!rTokenData ||
      !rTokenData.token ||
      !rTokenData.clientId) {
      return new Promise.reject('Missing parameters in access token');
    }

    return {
      token: rTokenData.token,
      clientId: rTokenData.clientId,
    };
  }
};

Service.$inject = ['accessTokenDao'];

module.exports = Service;