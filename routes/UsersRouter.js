/**
 * Created by Ankit Verma on 8/21/17.
 */
'use strict';
const expressPromiseRouter = require("express-promise-router");
const router = expressPromiseRouter();
const authAccessToken = require('../util/auth_tool').authAccessToken;
const GenericError = require('../util/errors').GenericError;

const Router = function (UserService) {

  const self = this;

  router.get('/me', authAccessToken, async (req, res) => {
    const user = req.user;
    const authInfo = req.authInfo;
    if (!authInfo) {
      throw new GenericError(5000, 'User not authorizsed.');
    }
    return res.success(user);
  });

  router.get('/:userId', authAccessToken, async (req, res) => {
    let userId = req.params.userId;
    if (!userId) {
      throw new GenericError(1000, 'No userId was given.');
    }
    let response = await UserService.fetchUserById(userId);
    delete response.salt;
    delete response.hashedPassword;
    return res.success(response);
  });

  router.post('/', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    if (!email) {
      throw new GenericError(1000, 'No email was given.');
    }
    if (!password) {
      throw new GenericError(1001, 'No password was given.');
    }
    const response = await UserService.initialUserInsert(first_name, last_name, email, password);
    return res.send(response);
  });

  self.router = router;

  return self;
};

Router.$inject = [
  'userService'
];

module.exports = Router;