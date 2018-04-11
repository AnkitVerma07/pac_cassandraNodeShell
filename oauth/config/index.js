/**
 * Created by donaldgreen on 2/4/16.
 */
'use strict';
exports.token = {
	calculateExpirationDate: function (expiresIn) {
		return new Date(new Date().getTime() + (expiresIn * 1000));
	},
	authorizationCodeLength: 16,
	accessTokenLength: 256,
	refreshTokenLength: 256
};