const express = require('express');
const passport = require('passport');
// const boom = require('@hapi/boom');

const notificationService = require('../services/notification');
const scopesValidationHandler =
require('../utils/middleware/scopeValidationHandler');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api/notification', router);

  router.get('/mys',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['read:notification']),
      async (req, res, next) => {
        try {
          const notifications = await notificationService
              .getNotificationByUser(req.user._id);

          res.json({
            message: 'ok',
            data: notifications,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });

  router.post('/',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['create:notification']),
      async (req, res, next) => {
        try {
          const {title, body, for: _for} = req.body;
          const notifications = await notificationService
              .createNotification(title, body, _for);

          res.json({
            message: 'ok',
            data: notifications,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
  router.post('/read/:id',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['markAsRead:notification']),
      async (req, res, next) => {
        try {
          const notifications = await notificationService
              .markAsRead(req.params.id, req.user._id);

          res.json({
            message: 'ok',
            data: notifications,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
  router.delete('/:id',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['deleted:notification']),
      async (req, res, next) => {
        try {
          const notifications = await notificationService
              .deletedNotification(req.params.id, req.user._id);

          res.json({
            message: 'ok',
            data: notifications,
          }).status(200);
        } catch (error) {
          next(error);
        }
      });
};
