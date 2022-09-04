const boom = require('@hapi/boom');
const config = require('../../config');

const withErrorStack = (error, stack) => {
  if (config.dev) {
    return {...error, stack};
  }

  return error;
};

const logErrors = (err, req, res, next) => {
  console.log(err);
  next(err);
};

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
};

const errorHandler = (err, req, res, next) => {
  const {
    output: {statusCode, payload},
  } = err;
  console.log('send Error');
  res.json(withErrorStack(payload, err.stack)).status(statusCode);
};

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
