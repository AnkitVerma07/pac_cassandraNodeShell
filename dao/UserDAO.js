
'use strict';
const UserDAO = function (CassandraUserDAO) {

  const self = this;
  self.getUserById = CassandraUserDAO.getUserById;
  self.fetchEmailAccount = CassandraUserDAO.fetchEmailAccount;
  self.saveUserWithEmailAccount = CassandraUserDAO.saveUserWithEmailAccount;
  self.updateEmailClaimed = CassandraUserDAO.updateEmailClaimed;
  self.findByIdWithUser = CassandraUserDAO.findByIdWithUser;

  return self;
};

UserDAO.$inject = ['cassandraUserDao'];

module.exports = UserDAO;