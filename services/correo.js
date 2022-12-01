const axios = require('axios');
const catalogoService = require('./catalogos');
const cartonesService = require('./cartones');
const userService = require('./users');
const eventoService = require('./evento');

const config = require('../config');

// const sleep = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

const sendConfirmationEmail = async (id, cartones, orden) => {
  const user = await userService.getUserById(id);
  let cartonesSend;
  if (!cartones[0]) {
    cartonesSend = await cartonesService.getCarton({user: id});
  } else {
    cartonesSend = cartones;
  }
  const [catalogos, evento] = await Promise.all([
    catalogoService.getCatalogo(), eventoService.get(),
  ]);

  const fecha = evento.internacional ?
    evento.naciones[
        evento.naciones.indexOf(
            evento.naciones.filter((e)=>e.name==user.pais)[0],
        )
    ].fecha:
    evento.fecha;

  await axios({
    method: 'post',
    url: `${config.serviceCorreoUrl}/api/sendConfirmationEmail`,
    data: {
      key: config.serviceCorreoKey,
      email: user.email,
      name: user.name,
      cartones: cartonesSend,
      catalogos,
      orden,
      fecha,
    },
  });
};

const sendCodeChangePassword = async (user, code) => {
  await axios({
    method: 'post',
    url: `${config.serviceCorreoUrl}/api/sendCodeChangePassword`,
    data: {
      key: config.serviceCorreoKey,
      email: user.email,
      name: user.name,
      code,
    },
  });
};

const massageOrden = async (user, message) => {
  await axios({
    method: 'post',
    url: `${config.serviceCorreoUrl}/api/massageOrden`,
    data: {
      key: config.serviceCorreoKey,
      email: user.email,
      name: user.name,
      message,
    },
  });
};

module.exports = {
  sendConfirmationEmail,
  sendCodeChangePassword,
  massageOrden,
};
