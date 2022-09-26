const express = require('express');
// const boom = require('@hapi/boom');
const passport = require('passport');

// const catalogoService = require('../services/catalogos');
// const CartonesService = require('../services/cartones');
// const OrdenesService = require('../services/ordenes');
// const PlayService = require('../services/play');
// const eventoService = require('../services/evento');
// const entradasService = require('../services/entradas');
const correo = require('../services/correo');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api/test', router);

  router.post('/correoTest',
      passport.authenticate('jwt', {session: false}),

      (req, res)=>{
        // console.log(req.user);
        correo.sendConfirmationEmail(req.user._id, [], []);
        res.send('ok');
      });
};
