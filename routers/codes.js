const express = require('express');
const passport = require('passport');
// const boom = require('@hapi/boom');

const codesService = require('../services/codes');
const scopesValidationHandler =
require('../utils/middleware/scopeValidationHandler');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api/code', router);

  router.get('/nCanjeados',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['readAll:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getNumberCodeCanjeados();

          res.json({
            message: 'ok',
            data: code.getCode,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.get('/',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['readAll:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getCodeAll();

          res.json({
            message: 'ok',
            data: code.getCode,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.get('/code/:code',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['read:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getCodeByCode(req.params.code);

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.get('/user/:user',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['read:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .getCodeByUser(req.params.user);

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
      scopesValidationHandler(['create:code']),
      async (req, res, next) => {
        try {
          const {code, user, entrada} = req.body;
          const createCode = await codesService
              .createCodes(code, user, entrada);

          res.json({
            message: 'ok',
            data: createCode,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
  router.post('/canjear/:code', // create
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['canjear:code']),
      async (req, res, next) => {
        try {
          const {code} = req.params;
          const createCode = await codesService
              .canjear(code, req.user._id, req.user.email);

          if (createCode.err) {
            return res.status(200).json({
              message: 'ya canjeado',
            });
          }

          return res.json({
            message: 'ok',
            data: createCode,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
  router.post('/active/:code',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['markAsActive:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .markAsActive(req.params.code, req.body.user);

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
  router.delete('/:id',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['deleted:code']),
      async (req, res, next) => {
        try {
          const code = await codesService
              .deletedCodes(req.params.id, req.user._id);

          res.json({
            message: 'ok',
            data: code,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
};
