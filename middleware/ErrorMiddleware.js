
'use strict';
const ErrorMiddleware = function() {

  const self = this;

  self.errorMiddleware = function(fn) {
    return function(err) {
      let jsonRPCError = {
        code: err.code || 400,
        message: err.message || 'Something went wrong'
      };
      jsonRPCError.data = process.env.DEBUG ? err.stack || err : undefined;
      return fn(jsonRPCError);
    }
  };

  return self;
};

module.exports = ErrorMiddleware;