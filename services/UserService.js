
'use strict';
const validator = require('validator');
const GenericError = require('../util/errors').GenericError;


const Service = function(UserDAO, common, constants) {

  const self = this;

  self.fetchUserById = UserDAO.getUserById;
  self.fetchEmailAccount = UserDAO.fetchEmailAccount;
  self.findByIdWithUser = UserDAO.findByIdWithUser;

  self.initialUserInsert = async(first_name, last_name, email, password) => {
    let userData = {
      first_name,
      last_name,
      email,
      password
    };
    const normalizedEmail = await validator.normalizeEmail(userData.email);
    // const emailAddr = await UserDAO.fetchEmailAccount(normalizedEmail);
    // if (emailAddr) {
    //   throw new GenericError(2000, 'Email has been taken by another user.');
    // }
    // let emailData = {};
    // if (emailAddr === null) {
    //   emailData = {id: normalizedEmail};
    // }
    const savedUser = await UserDAO.saveUserWithEmailAccount(userData);
    //await UserDAO.updateEmailClaimed(savedUser.email);
    return savedUser;
  };

  return self;
};

Service.$inject = [
  'userDao',
  'common',
  'constants'
];

module.exports = Service;