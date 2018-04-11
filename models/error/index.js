

'use strict';
const util = require("util");

let errors = {};

errors.GenericError = function GenericError(code, message) {
  this.name = this.constructor.name;
  this.message = message || 'Error';
  this.code = code || 1000;
  Error.captureStackTrace(this, this.constructor);
};

util.inherits(errors.GenericError, Error);

module.exports = errors;