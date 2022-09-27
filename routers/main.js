const express = require('express');
// const boom = require('@hapi/boom');
const passport = require('passport');

const catalogoService = require('../services/catalogos');
const CartonesService = require('../services/cartones');
const OrdenesService = require('../services/ordenes');
const PlayService = require('../services/play');
const eventoService = require('../services/evento');
const entradasService = require('../services/entradas');
const adminData = require('../services/adminData');

const scopesValidationHandler =
require('../utils/middleware/scopeValidationHandler');

require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api', router);

  router.get('/initialState',
      async (req, res, next)=>{
        try {
          let initialState;

          if (req.headers.authorization) {
            await passport.authenticate('jwt',
                {session: false})(req, res, async (e) =>{
              // console.log(req.user);
              const user = {
                name: req.user.name,
                email: req.user.email,
                id: req.user._id,
                admin: !!req.user.idAdmin,
              };

              const [
                vars,
                entradas,
                cartones,
                myInProgressOrden,
                myEndsOrden,
                catalogo,
                play,
              ] = await Promise.all([
                eventoService.get(),
                entradasService.getEntradaByUser(req.user._id),
                CartonesService.getCarton({user: req.user._id}),
                OrdenesService.getOrden(req.user._id),
                OrdenesService.getOrdenTerminadas(req.user._id),
                catalogoService.getCatalogo(),
                PlayService.getPlay(),
              ]);
              // const vars = await eventoService.get();
              // const cartones = await CartonesService
              //     .getCarton({user: req.user._id});
              // const myInProgressOrden = await OrdenesService
              //     .getOrden(req.user._id);
              // const myEndsOrden = await OrdenesService
              //     .getOrdenTerminadas(req.user._id);
              // const catalogo = await catalogoService.getCatalogo();
              // const play = await PlayService.getPlay();

              initialState = {
                'user': user,
                'vars': vars,
                'entrada': entradas.getEntrada,
                'redirect': '',
                'cartonesUser': cartones.map((e)=>{
                  return {
                    ...e,
                    play: [
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                    ],
                  };
                }),
                'ordenes': {
                  enProgreso: myInProgressOrden[0] ? myInProgressOrden[0] : {},
                  terminadas: myEndsOrden,
                },
                'catalogos': catalogo,
                'play': play,
                'carrito': {
                  active: false,
                  state: (myInProgressOrden.user ? 1 : 0),
                  data: [],
                },
              };

              res.json({
                message: 'ok',
                data: initialState,
              }).status(200);
            });
          } else {
            const [vars, catalogo] = await Promise.all([
              eventoService.get(), catalogoService.getCatalogo(),
            ]);
            // const vars = await eventoService.get();
            // const catalogo = await catalogoService.getCatalogo();
            initialState = {
              'user': {},
              'vars': vars,
              'redirect': '',
              'cartonesUser': [],
              'ordenes': {
                enProgreso: {},
                terminadas: [],
              },
              'catalogos': catalogo,
              'play': {
                estado: 0,
                serieJuego: 1,
              },
              'carrito': {
                active: false,
                state: 0,
                data: [],
              },
            };

            res.json({
              message: 'ok',
              data: initialState,
            }).status(200);
          }
        } catch (error) {
          throw new Error(error);
        }
      },
  );

  router.get('/getState',
      async (req, res, next)=>{
        try {
          let getState;

          if (req.headers.authorization) {
            await passport.authenticate('jwt',
                {session: false})(req, res, async (e) =>{
              const user = {
                name: req.user.name,
                email: req.user.email,
                id: req.user._id,
                admin: !!req.user.idAdmin,
              };
              const [
                entrada,
                cartones,
                myInProgressOrden,
                myEndsOrden, play,
              ] = await Promise.all([
                entradasService.getEntradaByUser(req.user._id),
                CartonesService.getCarton({user: req.user._id}),
                OrdenesService.getOrden(req.user._id),
                OrdenesService.getOrdenTerminadas(req.user._id),
                PlayService.getPlay(),
              ]);
              // const cartones = await CartonesService
              //  .getCarton({user: req.user._id});
              // const myInProgressOrden = await OrdenesService
              //     .getOrden(req.user._id);
              // const myEndsOrden = await OrdenesService
              // .getOrdenTerminadas(req.user._id);
              // const play = await PlayService.getPlay();

              getState = {
                'user': user,
                'entrada': entrada.getEntrada,
                'cartonesUser': cartones.map((e)=>{
                  return {
                    ...e,
                    play: [
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                      [false, false, false, false, false],
                    ],
                  };
                }),
                'ordenes': {
                  enProgreso: myInProgressOrden[0] ? myInProgressOrden[0] : {},
                  terminadas: myEndsOrden,
                },
                'play': play,
              };

              res.json({
                message: 'ok',
                data: getState,
              }).status(200);
            });
          } else {
            getState = {
              'user': {},
              'redirect': '',
              'cartonesUser': [],
              'ordenes': {
                enProgreso: {},
                terminadas: [],
              },
              'play': {
                estado: 0,
                serieJuego: 1,
              },
            };

            res.json({
              message: 'ok',
              data: getState,
            }).status(200);
          }
        } catch (error) {
          throw new Error(error);
        }
      },
  );

  router.get('/admin',
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['admin']),
      async (req, res) => {
        const data = await adminData.getAdminData();
        res.status(200).json({
          data,
        });
      },
  );
};
