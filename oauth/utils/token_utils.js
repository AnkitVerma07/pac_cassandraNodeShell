/**
 * Created by donaldgreen on 2/10/16.
 */
'use strict';
const config = require(process.cwd() + '/oauth/config');
const utils = require('./oauth_utils');

const TokenUtils = function(AccessTokenService) {

	const self = this;

	/**
	 *
	 * @param client
	 * @param user
	 * This is a custom method created to help generate and accessToken and refreshToken for a given user with the given
	 * client. When this method is called, we have already verified that the user is authentic and has permissions to
	 * generate and receive their tokens. We begin by generating the token values and calculating the expiration date
	 * for the newly generated accessToken. Once the models are initialized we begin with saving the refresh token first
	 * and upon success, take the unique id from the database of the refresh token and save this value into the accessToken
	 * property 'refreshTokenId' before saving the access token into the datastore. Upon success of finallay saving the
	 * accessToken, return the data into the callback to be returned as a JSON response.
	 */
	self.generateTokens = function(client, user) {
		let tokenValue = utils.uid(config.token.accessTokenLength);
		let refreshTokenValue = utils.uid(config.token.refreshTokenLength);

		// figure out the expiration date of an access token based on the client properties
		let expirationDate = null;
		if (client.tokenValiditySeconds) {
			expirationDate = config.token.calculateExpirationDate(client.tokenValiditySeconds);
		}

		// Start RethinkDB implementation
		let refreshToken = {
			token: refreshTokenValue,
			clientId: client.clientId,
		};

		let accessToken = {
			token: tokenValue,
			userId: user.id,
			clientId: client.clientId,
			dateExpired: expirationDate,
		};

		return AccessTokenService.saveTokenSet(accessToken, refreshToken);
	};


	/**
	 *
	 * @param localClient
	 * @param user
	 * @param done
	 */
	self.getTokens = function(localClient, user, done) {

		// RethinkDB Implementation
		return AccessTokenService.findTokenWithUserId(user.id).then(function(accessToken) {

			if (!accessToken) {
				return self.generateTokens(localClient, user).then(function(genAccessToken) {
					return sendTokenResponse(genAccessToken, done);
				}).catch(function(err) {
					return done(err);
				});
			}

			// Access token exists
			// check if the access token retrieved has expired
			if (Date.now() < new Date(accessToken.dateExpired)) {
				return sendTokenResponse(accessToken, done);
			}

			// Remove the access and refresh token
			return accessToken.deleteAll({ refreshToken: true }).then(function(result) {

				// generate new tokens
				return self.generateTokens(localClient, user);
			}).then(function(accessToken) {
				return sendTokenResponse(accessToken, done);
			}).catch(function(err) {
				return done(err);
			});
		}).catch(function(err) {
			return done(err);
		});
	};

	function sendTokenResponse(accessToken, cb) {

		// calculate the amount of seconds until the token expires
		let expiresInSec = Math.floor((accessToken.dateExpired.getTime() - Date.now()) / 1000);
		return cb(null, accessToken.token, accessToken.refreshToken.token, { expires_in: expiresInSec });
	}

	return self;
};

TokenUtils.$inject = ['accessTokenService'];

module.exports = TokenUtils;
