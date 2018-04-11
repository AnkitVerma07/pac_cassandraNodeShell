/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

const util = require('util');

const errors = {};

errors.AuthError = function AuthError(code, message, statusCode) {
  this.name = this.constructor.name;
  this.message = message || 'Unauthorized';
  this.code = code || 4000;
  this.status = statusCode || 403;
  Error.captureStackTrace(this, this.constructor);
};

util.inherits(errors.AuthError, Error);

errors.GenericError = function GenericError(code, message, statusCode) {
  this.name = this.constructor.name;
  this.message = message || 'Error';
  this.code = code || 1000;
  this.status = statusCode || 400;
  Error.captureStackTrace(this, this.constructor);
};

util.inherits(errors.GenericError, Error);

module.exports = errors;
