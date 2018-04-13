'use strict';

const client = require("../../util/cassandra");
const models = require("../../models/index");
const GenericError = require('../../util/errors').GenericError;

const CassandraUserDAO = function (constants) {

  const self = this;

  self.getUserById = async (userId) => {
    const query = 'SELECT name, email FROM users WHERE key = ?';
    const result = await client.execute(query, [ userId ])
    if(result.rows.length > 0){
      const user = result.rows[0];
      return user
    }else{
      return 'error';
    }
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