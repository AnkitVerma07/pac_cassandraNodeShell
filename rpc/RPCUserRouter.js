
'use strict';
const Promise = require('bluebird');
const errors = require('../models/error');
const RPCUserRouter = function(ErrorMiddleware, UserCheckMiddleware) {

  const errorMiddleware = ErrorMiddleware.errorMiddleware;
  const checkUserBanned = UserCheckMiddleware.checkUserBanned;

  const self = this;

  // self.registerUser = checkUserBanned((args) => {
  //   let firstname = args.firstname;
  //   let lastname = args.lastname;
  //   let email = args.email;
  //   let password = args.password;
  //   let type = args.type;
  //   if(!email){
  //     return Promise.reject(new Error('No email was given.'));
  //   }
  //   return UserService.initialUserInsert(firstname, lastname, email, password, type).catch(errorMiddleware(err => err));
  // });

  return self;
};

RPCUserRouter.$inject = [
  'errorMiddleware',
  'userCheckMiddleware'
];

module.exports = RPCUserRouter;