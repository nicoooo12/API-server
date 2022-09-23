const express = require('express');
const passport = require('passport');
// const boom = require('@hapi/boom');

const codesService = require('../services/entradas');
// const scopesValidationHandler =
// require('../utils/middleware/scopeValidationHandler');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api/entradas', router);

  router.get('/count-entradas',
      passport.authenticate('jwt', {session: false}),
      // scopesValidationHandler(['read:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getCountEntradas();

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.get('/:user',
      passport.authenticate('jwt', {session: false}),
      // scopesValidationHandler(['read:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getEntradaByUser(req.params.user);

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.post('/', // create
      passport.authenticate('jwt', {session: false}),
      // scopesValidationHandler(['create:code']),
      async (req, res, next) => {
        try {
          const createCode = await codesService
              .createEntrada(req.user.email);

          res.json({
            message: 'ok',
            data: createCode,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.delete('/:id',
      passport.authenticate('jwt', {session: false}),
      // scopesValidationHandler(['deleted:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .deletedEntrada(req.params.id);

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
};
