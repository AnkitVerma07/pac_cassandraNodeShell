'use strict';
/**
 * Created by Ankit Verma on 6/18/17.
 *
 * Cleared up the authorization middleware issue where promises where not able to be used using information
 * from this github issue comments: https://github.com/tedeh/jayson/issues/54
 *
 * Here we are creating an Authentication middleware to use for our RPC methods utilizing an existing
 * "passport.js" middleware implementation used on the REST api using Express.js. In order to add
 * authentication to any of our RPC endpoints, all that is needed is to clamp this method around the
 * original function. If an error occurs, the error will be passed up to the client right away through
 * the provided callback. If successful, the information returned from authentication will be injected
 * into the original request *args* object as *args.authorized* where the authorized object contains two
 * objects: 1) The user object model, 2) The authorization information.
 *
 * FOR passport.authenticate():
 * Here we manually invoke the passport.authenticate method using the "accessToken" strategy.
 * The authenticate method here takes 3 values: 1) The name of the stategy to use, 2) options for authentication
 * 3) A callback function to be called when verification is finished. To invoke the passport.authenticate,
 * we add the outside set of parenthesis with the request object inside for it to be passed as a variable.
 *
 * TODO: Create a concise description of what this class is doing
 */
const passport = require('passport');
const Promise = require('bluebird');
const errors = require('../models/error');
const PassportAuthMiddleware = function() {

  const self = this;

  self.authorized = function(fn) {
    return function(args) {
      return new Promise(function(resolve, reject) {
        let request = {
          body: args.body
        };

        passport.authenticate('accessToken', {session: false}, _handleCallback(function(err, user, info) {
          if (err) {
            return reject(err);
          }

          args.authorized = {
            user: user,
            info: info
          };

          return resolve(fn(args));
        }))(request);
      });
    }
  };

  self.authenticateFB = function(fn) {
    return function(args) {
      return new Promise(function(resolve, reject) {
        let request = {
          body: args.body
        };

        passport.authenticate('facebook-token', function(err, user, info) {
          if (err) {
            // If we are throwing a custom error, return the json instead of passing through the
            // ConsistentResponseMiddleware
            if (err instanceof errors.SocialAuthError) {
              console.log('[SocialRouter] -> (Facebook) SocialAuthError', err);
              return reject(err);
            }

            // This should handle any errors that come from facebook itself.
            if (!!err.oauthError) {
              console.log('[SocialRouter] -> (Facebook) oauthError', err);
              return reject(new errors.SocialAuthError(1009, err.message));
            }

            // If we have an unexpected error, return as a status 500 as this is probably due to
            // database unreachable or other major problems
            return reject(err);
          }

          args.authenticated = {
            user: user,
            info: info
          };

          return resolve(fn(args));
        })(request);
      });
    }
  };

  self.authenticateCredentials = (fn) => {
    return (args) => {
      return new Promise((resolve, reject) => {
        const request = {
          body: args.body,
        };

        passport.authenticate('local', (err, usr) => {
          if (err) {
            // If we are throwing a custom error, return the json instead of passing through the
            // ConsistentResponseMiddleware
            if (err instanceof errors.SocialAuthError) {
              console.log('[SocialRouter] -> (Facebook) SocialAuthError', err);
              return reject(err);
            }

            // If we have an unexpected error, return as a status 500 as this is probably due to
            // database unreachable or other major problems
            return reject(err);
          }

          args.authenticated = {
            user: usr,
          };

          return resolve(fn(args));
        })(request);
      });
    }
  };

  return self;
};

/**
 * Here we wrote a simple middleware function mainly to intercept any errors that are returned and
 * translate them into the proper format for JSON-RPC 2.0
 */
function _handleCallback(fn) {
  return function(err, user, info) {
    if (err) {
      let customError = {
        code: err.code || 401,
        message: err.message || 'Unauthorized'
      };
      customError.data = process.env.DEBUG ? err.stack || err : undefined;
      return fn(customError);
    }

    if (!user) {
      let otherError = {
        code: 401,
        message: 'Unauthorized'
      };
      return fn(otherError);
    }

    return fn(null, user, info);
  }
}

module.exports = PassportAuthMiddleware;