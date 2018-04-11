/**
 * Created by Ankit Verma on 3/31/17.
 */
'use strict';
const errors = require('../models/error');
const UserCheckMiddleware = function(UserDAO) {

  const self = this;

  self.checkUserBanned = function(fn) {
    return function(args) {
      return new Promise( (resolve,reject) => {
        let userId = args.userId;

        return UserDAO.fetchUserById(userId).then( (user)=> {
          if(!user){
            return resolve(fn(args));
          }
          if(user.banned === true){
            return reject(new errors.GenericError(400, 'This user is banned'));
          }
          return resolve(fn(args));
        });

      });
    }
  };

  return self;
};

UserCheckMiddleware.$inject = [
  'userDao'
];

module.exports = UserCheckMiddleware;