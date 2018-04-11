/**
 * Created by Ankit Verma on 8/21/17.
 */
'use strict';
const passport = require('passport');
const AuthError = require('./errors').AuthError;

const AuthTool = (() => {
  return {
    authAccessToken: (req, res, next) => {
      passport.authenticate('accessToken', (err, user, info) => {
        if (err) {
          const responseObject = {
            code: err.code,
            message: err.message,
            error: req.app.get('env') === 'development' ? err.stack : {},
          };

          return res
            .status(err.status || 500)
            .json(responseObject);
        }

        if (!user) {
          return res
            .status(403)
            .json(new AuthError(4000, 'Unauthorized', 403));
        }

        if (req.sessionID !== info.sessionId) {
          return res
            .status(403)
            .json(new AuthError(4000, 'Unauthorized: Session is invalid', 403));
        }

        req.user = user;
        req.authInfo = info;
        next();
      })(req, res, next);
    },
  };
})();

module.exports = AuthTool;
