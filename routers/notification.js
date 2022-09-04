const express = require('express');
// const boom = require('@hapi/boom');
// const passport = require('passport');

const notificationService = require('../services/notification');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api', router);

  router.get('/mys',
      passport.authenticate('jwt', {session: false}),

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
};
