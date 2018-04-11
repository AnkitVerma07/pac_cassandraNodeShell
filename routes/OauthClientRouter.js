
'use strict';
const expressPromiseRouter = require("express-promise-router");
const router = expressPromiseRouter();
const fs = require('fs');

const config = require('../config/config');

const Router = function(OauthClientService) {

  const self = this;


  router.post('/', async(req, res) => {
    const clientData = req.body;
    const response = await OauthClientService.createOauthClient(clientData);
    return res.success(response);
  });


  self.router = router;

  return self;
};

Router.$inject = ['oauthClientService'];

module.exports = Router;
