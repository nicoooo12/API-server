const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const apiKeysService = require('../services/apiKeys');
const usersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');
const {sendCodeChangePassword} = require('../services/correo');

const scopesValidationHandler =
require('../utils/middleware/scopeValidationHandler');

const {
  createUserSchema,
  updateUserSchema,
  forgottenPassword,
  resetPassword,
} = require('../utils/schemas/users');
// const idSchema = require('../utils/schemas/id');

const config = require('../config');

// Basic strategy
require('../utils/auth/strategies/basic');
require('../utils/auth/strategies/jwt');

const authApi = (app) => {
  const router = new express.Router();
  app.use('/api/auth', router);

  router.post('/sign-in', async (req, res, next) => {
    const {apiKeyToken} = req.body;

    if (!apiKeyToken) {
      return next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', async function(error, user) {
      try {
        if (error || !user) {
          return next(boom.unauthorized());
        }
        req.login(user, {session: false}, async function(error) {
          if (error) {
            return next(error);
          }

          const setApiKeyToken = user.isAdmin ?
            config.adminApiKeyToken : config.publicApiKeyToken;

          const apiKey = apiKeysService.getApiKey({token: setApiKeyToken});
          if (!apiKey) {
            return next(boom.unauthorized());
          }

          const {_id: id, name, email, isAdmin, pais} = user;

          const payload = {
            sub: id,
            name,
            email,
            pais: pais || 'chile',
            isAdmin: isAdmin,
            scopes: apiKey,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '20d',
          });

          return res.status(200).json({
            token,
            user: {
              id,
              name,
              email,
              pais,
              isAdmin: isAdmin,
            },
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up',
      validationHandler(createUserSchema),
      async function(
          req,
          res,
          next,
      ) {
        const {body: user} = req;

        try {
          const createdUserId = await usersService.createUser({user});

          if (createdUserId.err) {
            return next(boom.badRequest(createdUserId.message));
          }

          res.status(201).json({
            data: createdUserId.data,
            message: 'user created',
          });
        } catch (error) {
          next(error);
        }
      });

  router.post('/forgottenPassword',
      validationHandler(forgottenPassword),

      async (req, res, next)=>{
        const {email} = req.body;

        const request = await usersService.changePasswordRequest(email);

        if (request.err) {
          return next(request.message);
        }

        sendCodeChangePassword(request.user, request.code);

        res.status(200).json({
          massage: 'ok',
        });
      });

  router.post('/resetPassword',
      validationHandler(resetPassword),
      async (req, res, next)=>{
        const {email, code, password} = req.body;

        const request = await usersService
            .changePassword(email, code, password);

        if (request.err) {
          return next(request.message);
        }

        res.status(200).json({
          massage: 'ok',
        });
      });

  router.put('/',
      passport.authenticate('jwt', {session: false}),
      validationHandler(updateUserSchema),
      async (req, res, next)=>{
        try {
          const updateUser = await usersService.updateUser(
              req.user._id,
              req.body,
          );

          res.json({
            message: 'ok',
            data: updateUser,
          }).status(200);
        } catch (err) {
          next(err);
        }
      });

  router.get('/:correo',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['read:cartonUser']),
      async (req, res, next)=>{
        try {
          const getUser = await usersService.getUser({
            email: req.params.correo,
          });
          res.json({
            message: 'ok',
            data: {
              email: getUser.email,
              name: getUser.name,
              pais: getUser.pais,
              id: getUser._id,
            },
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
};

module.exports = authApi;

