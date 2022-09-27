const config = require('../config');
const boom = require('@hapi/boom');

const getApiKey = ({token}) => {
  if (token === config.publicApiKeyToken) {
    return [
      'signin:auth',
      'signup:auth',
      'create:myOrden',
      'create:canvasOrden',
      'read:myOrden',
      'update:myOrden',
      'deleted:myOrden',
      'read:myCarton',
      'read:catalogos',
      'read:notification',
      'deleted:notification',
      'markAsRead:notification',
      'markAsActive:code',
      'read:code',
      'canjear:code',
    ];
  } else if (token === config.adminApiKeyToken) {
    return [
      'signin:auth',
      'signup:auth',
      'create:myOrden',
      'create:orden',
      'create:canvasOrden',
      'create:commentOrden',
      'read:myOrden',
      'read:ordenId',
      'read:ordenes',
      'read:canvas',
      'read:myCanvas',
      'update:myOrden',
      'update:orden',
      'deleted:myOrden',
      'deleted:orden',
      'end:orden',
      'create:carton',
      'read:myCarton',
      'read:cartonUser',
      'read:cartonById',
      'read:cartones',
      'deleted:carton',
      'create:catalogo',
      'read:catalogos',
      'update:catalogo',
      'deleted:catalogo',
      'put:play',
      'read:notification',
      'create:notification',
      'deleted:notification',
      'markAsRead:notification',
      'read:code',
      'create:code',
      'markAsActive:code',
      'deleted:code',
      'canjear:code',
      'readAll:code',
      'admin',
    ];
  }
  return boom.badRequest('token not valid');
};

/**
 create:
 read:
 update:
 deleted:
 */

module.exports = {
  getApiKey,
};
