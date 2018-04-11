/**
 * Created by donaldgreen on 1/29/16.
 */
'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const TwitterStrategy = require('passport-twitter-token');
const FacebookStrategy = require('passport-facebook-token');

const config = require('../config/config');
const clients = require('../models/memory/clients');
const errors = require('../models/error');

const Auth = function(UserService, AccessTokenService, common) {

	/**
	 * LocalStrategy
	 *
	 * This strategy is used to authenticate users based on a username and password.
	 * Anytime a request is made to authorize an application, we must ensure that
	 * a user is logged in before asking them to approve the request.
	 */
	passport.use(new LocalStrategy(
		(username, password, done) => {
      UserService.fetchEmailAccount(username).then((emailAccount) => {
				if (!emailAccount) {
					return done(new errors.SocialAuthError(1020, 'No User Found by that email'));
				}

				return UserService.fetchUser(emailAccount.userId).then(function(user) {
					if (!user) {
						return done(new errors.SocialAuthError(1021, 'No User found registered with this' +
																												 ' Email account'));
					}

					if (!user.checkPassword(password)) {
						return done(new errors.SocialAuthError(1022, 'Password was invalid for this user' +
																											' account'));
					}

					return UserService.getFullUserInfo(emailAccount.userId).then((fullUser) => {
						if (user.banned) {
							return done(new errors.GenericError(400, 'This user is banned'));
						}

						common.buildUserProfileImageUrls(fullUser);
						return done(null, fullUser);
					});
				});
			});
		}
	));


	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});


	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});


	/**
	 * BasicStrategy & ClientPasswordStrategy
	 *
	 * These strategies are used to authenticate registered OAuth clients.  They are
	 * employed to protect the `token` endpoint, which consumers use to obtain
	 * access tokens.  The OAuth 2.0 specification suggests that clients use the
	 * HTTP Basic scheme to authenticate.  Use of the client password strategy
	 * allows clients to send the same credentials in the request body (as opposed
	 * to the `Authorization` header).  While this approach is not recommended by
	 * the specification, in practice it is quite common.
	 */
	passport.use(new BasicStrategy(
		function(username, password, done) {
			clients.findByClientId(username, function(err, client) {
				if (err) {
					return done(err);
				}

				if (!client) {
					return done(null, false);
				}

				if (client.clientSecret != password) {
					return done(null, false);
				}

				return done(null, client);
			});
		}
	));

	/**
	 *
	 */
	passport.use(new ClientPasswordStrategy(
		function(clientId, clientSecret, done) {
			clients.findByClientId(clientId, function(err, client) {
				if (err) {
					return done(err);
				}

				if (!client) {
					return done(null, false);
				}

				if (client.clientSecret != clientSecret) {
					return done(null, false);
				}

				return done(null, client);
			});
		}
	));


	/**
	 * BearerStrategy
	 *
	 * This strategy is used to authenticate users based on an access token (aka a
	 * bearer token).  The user must have previously authorized a client
	 * application, which is issued an access token to make requests on behalf of
	 * the authorizing user.
	 */
	passport.use('accessToken', new BearerStrategy(
		function(accessToken, done) {
			AccessTokenService.findByToken(accessToken).then(function(token) {
				if (!token) {
					return done(new Error('Unauthorized: Invalid Access Token'), false);
				}

				// Check if the access token has expired and return false if expired
				if (Date.now() > new Date(token.dateExpired)) {
					return done(new Error('Unauthorized: AccessToken expired.'));
				}

				UserService.fetchUserWithout(token.userId, ['hashedPassword', 'salt', 'curPoint']).then(function(user) {

					if (!user) {
						return done(new Error('Unauthorized: User does not exist'), false);
					}

					// Get the client information to pass through to the endpoint protected to further determine if the user
					// has the proper authorities to access the endpoint
					clients.findByClientId(token.clientId, function(err, client) {
						if (err) {
							return done(err);
						}

						if (!client) {
							return done(new Error('Unauthorized'));
						}

						let info = {
							scope: '*',
							authorities: client.authorities
						};

						return done(null, user, info);
					});
				}).error(function(err) {
					return done(err);
				});
			}).catch(function(err) {
				return done(err);
			});
		}
	));

	/* passport.use(new TwitterStrategy({
			consumerKey: config.get('twitterConsumerKey'),
			consumerSecret: config.get('twitterConsumerSecret'),
		},
		function(token, tokenSecret, profile, done) {
			SocialService.fetchSocialAccount(profile.id).then(function(socialAccount) {
				if (!socialAccount) {
					return done(new errors.SocialAuthError(1010, 'No record found for this Twitter account'));
				}

				return UserService.getFullUserInfo(socialAccount.userId);
			}).then(function(user) {
				if (!user) {
					return done(new errors.SocialAuthError(1011, 'No User found registered with this Twitter account'));
				}

				// let avatarUpdatedTime = user.avatarUpdatedAt ? user.avatarUpdatedAt.getTime() : null;
				// user.avatarURL = common.buildAvatarUrl(user.avatarFilename, avatarUpdatedTime);
				common.buildUserProfileImageUrls(user);
				return done(null, user);
			}).catch(function(err) {
				return done(err);
			});
		}
	));*/

	// passport.use(
	// 	new FacebookStrategy(config.get('facebookAPI'),
	// 	function(fbAccessToken, fbRefreshToken, profile, done) {
	// 		return SocialService.fetchSocialAccount(profile.id).then(function(socialAccount) {
	// 			if (!socialAccount) {
	// 				return done(new errors.SocialAuthError(1000, 'No record found for this Facebook account'));
	// 			}
  //
	// 			return UserService.getFullUserInfo(socialAccount.userId).then(function(user) {
	// 				if (!user) {
	// 					return done(new errors.SocialAuthError(1001, 'No User found registered with this Facebook account'));
	// 				}
  //
	// 				if (user.banned) {
	// 					return done(new errors.GenericError(400, 'This user is banned'));
	// 				}
  //
	// 				// let avatarUpdatedTime = user.avatarUpdatedAt ? user.avatarUpdatedAt.getTime() : null;
	// 				// user.avatarURL = common.buildAvatarUrl(user.avatarFilename, avatarUpdatedTime);
	// 				common.buildUserProfileImageUrls(user);
	// 				return done(null, user);
	// 			});
	// 		}).catch(function(err) {
	// 			return done(err);
	// 		});
	// 	}
	// ))
};

Auth.$inject = ['userService', 'accessTokenService', 'common'];

module.exports = Auth;
