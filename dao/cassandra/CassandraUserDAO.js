'use strict';

const models = require("../../models/index");
const GenericError = require('../../util/errors').GenericError;

const CassandraUserDAO = function (constants) {

  const self = this;

  self.getUserById = async (userId) => {

  };

  self.fetchUserById = (userId) => {

  };

  self.saveUserWithEmailAccount = async (userData) => {
    const user = new models.Users({
      first_name: userData.first_name,
      last_name:userData.last_name,
      email: userData.email,
      created: Date.now()
    });
    await user.save((err) => {
      if (err) {
        throw new GenericError(3000, err);
      }
      else {
        return user;
      }
    });
    return user;
  };

  self.fetchEmailAccount = function(email) {

  };

  self.updateEmailClaimed = function(id) {

  };

  self.findByIdWithUser = function(id) {

  };


  return self;
};

CassandraUserDAO.$inject = ['constants'];

module.exports = CassandraUserDAO;