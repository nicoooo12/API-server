const express = require('express');
const passport = require('passport');
// const boom = require('@hapi/boom');

const scopesValidationHandler =
require('../utils/middleware/scopeValidationHandler');
const validationHandler = require('../utils/middleware/validationHandler');
const refresh = require('../services/refresh');

const {
  createCatalogoSchema,
  editCatalogoSchema,
} = require('../utils/schemas/catalogo');
const idSchema = require('../utils/schemas/id');
const catalogoService = require('../services/catalogos');
require('../utils/auth/strategies/jwt');

module.exports = function(app) {
  const router = new express.Router();
  app.use('/api/catalogos', router);

  router.post('/', // create My orden (user.id, data)
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['create:catalogo']),
      validationHandler(createCatalogoSchema),
      async (req, res, next)=>{
        try {
          const {
            premios, titulo, subTitulo, precio, enVenta, serie, color, icon,
          } = req.body;
          const newCatalogo = await catalogoService.createCatalogo(
              premios,
              titulo,
              subTitulo,
              precio,
              enVenta,
              serie,
              color,
              icon,
          );

          await refresh();

          res.json({
            message: 'created',
            data: newCatalogo,
          }).status(201);
        } catch (err) {
          next(err);
        }
      });

  router.get('/', // create My orden (user.id, data)
      async (req, res, next)=>{
        try {
          const newCatalogo = await catalogoService.getCatalogo({});

          res.json({
            message: 'ok',
            data: newCatalogo,
          }).status(201);
        } catch (err) {
          next(err);
        }
      });

  router.put('/:id', // create My orden (user.id, data)
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['update:catalogo']),
      validationHandler(idSchema, 'params'),
      validationHandler(editCatalogoSchema),
      async (req, res, next)=>{
        try {
          const newCatalogo = await catalogoService.updateCatalogo(
              {_id: req.params.id},
              req.body,
          );

          await refresh();

          res.json({
            message: 'edited',
            data: newCatalogo,
          }).status(201);
        } catch (err) {
          next(err);
        }
      });

  router.delete('/:id', // create My orden (user.id, data)
      passport.authenticate('jwt', {session: false}),
      scopesValidationHandler(['deleted:catalogo']),
      validationHandler(idSchema, 'params'),
      async (req, res, next)=>{
        try {
          const newCatalogo = await catalogoService.deletedCatalogo(
              {_id: req.params.id},
          );
          await refresh();

          res.json({
            message: 'ok',
            data: newCatalogo,
          }).status(201);
        } catch (err) {
          next(err);
        }
      });
};
