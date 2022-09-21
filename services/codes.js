const store = require('../libs/mongoose');
const cartonesService = require('./cartones');
const eventoService = require('./evento');
const refreshService = require('./refresh');
// const config = require('../config');
const table = 'codes';
const {sendConfirmationEmail} = require('./correo');

const getCodeByCode = async (code) => {
  try {
    const getCode = await store.get(table, {code});
    return {err: false, getCode};
  } catch (error) {
    throw new Error(error);
  }
};

const getCodeByUser = async (user) => {
  try {
    const getCode = await store.get(table, {user});
    return {err: false, getCode};
  } catch (error) {
    throw new Error(error);
  }
};

const createCodes = async (code, user) => {
  try {
    const codes = await store.get(table, {code});
    if (codes[0]) {
      return {err: true};
    }
    const createCodes = await store.post(
        table, {code, user, active: ''},
    );
    return {err: false, createCodes};
  } catch (error) {
    throw new Error(error);
  }
};

const deletedCodes = async (code) => {
  try {
    const getCode = await store.get(table, {code});

    if (!getCode[0]) {
      return {message: 'carton already deleted or does not exist'};
    } else {
      await store.delt(table, {code});
      return {message: 'deleted successfully'};
    }
  } catch (error) {
    throw new Error(error);
  }
};

const canjear = async (code, user, correo) => {
  try {
    const [getCode] = await store.get(table, {code});
    if (getCode.active != '') {
      return {
        err: true,
        message: 'no valido',
      };
    }
    const canje = await markAsActive(code, user);

    const cartones = [];
    let cantidadCartonesNuevos = 0;

    [
      {serie: 1, cantidad: 1},
      {serie: 2, cantidad: 1},
      {serie: 4, cantidad: 1},
    ].map(async (e)=>{
      Array(e.cantidad).fill('', 0, e.cantidad).map(async (o, index)=>{
        const currentCarton = await cartonesService
            .createCarton(user, e.serie, cantidadCartonesNuevos + index);
        cartones.push(currentCarton);
      });
      cantidadCartonesNuevos = cantidadCartonesNuevos + e.cantidad;
    });

    // contabilidad
    const evento = await eventoService.get();
    await eventoService.editEvento({
      montoTotal: (evento.montoTotal + 6000),
      catonesComprados: (evento.catonesComprados + cantidadCartonesNuevos),
    });

    // correo
    sendConfirmationEmail(correo, cartones, [
      {serie: 1, cantidad: 1},
      {serie: 2, cantidad: 1},
      {serie: 4, cantidad: 1},
    ]);

    refreshService(user);

    return {
      err: false,
      data: {
        canje,
        cartones,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
};

const markAsActive = async (code, activeBy) => {
  try {
    const editCode = await store.put(
        table, {code}, {active: activeBy},
    );
    return editCode;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  canjear,
  getCodeByUser,
  getCodeByCode,
  createCodes,
  deletedCodes,
  markAsActive,
};
