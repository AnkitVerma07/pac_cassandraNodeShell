/**
 * Created by dgreen on 3/21/16.
 */
'use strict';
const clients = require(process.cwd() + '/models/memory/clients');

/**
 * Return a random int, used by `oauthUtils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isUser(role) {
	return clients.clientRoles.user === role || isAdmin(role);
}

function isAdmin(role) {
	return clients.clientRoles.admin === role;
}


/**
 * Return a unique identifier with the given `len`.
 *
 *     oauthUtils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
exports.uid = function(len) {
	let buf = [];
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charlen = chars.length;

	for (let i = 0; i < len; ++i) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}

	return buf.join('');
};

exports.checkUserRole = function(role) {
	return isUser(role);
};

exports.checkAdminRole = function(role) {
	return isAdmin(role);
};
