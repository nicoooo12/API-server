const store = require('../libs/mongoose');
const cartonesService = require('./cartones');
const eventoService = require('./evento');
const refreshService = require('./refresh');
const shortid = require('shortid');

const {sendConfirmationEmail} = require('./correo');

const table = 'ordenes';

const createOrden = async (
    compra, // Array
    totalPago, // Number
    tipoDePago, // String
    user, // String
    username, // String
) => {
  try {
    const getOrden = await store.get(table, {user});
    if (getOrden[0]) {
      return {err: true};
    }
    const code = shortid.generate();
    const newOrden = await store.post(table, {
      code,
      compra,
      totalPago,
      tipoDePago,
      username,
      estado: 2, // 0: finalizado, 1: en revisión, 2: incida
      canvasUrl: false, // estado = 2 -> no canvas url
      user,
    });

    return {err: false, newOrden};
  } catch (err) {
    throw new Error(err);
  }
};

const addCanvasUrl = async (code, canvasUrl) => {
  try {
    const orden = await store.get(table, {code} );

    if (!orden[0]) {
      throw new Error('invalid code');
    }

    const editOrden = await store.put(table, {user: orden[0].user}, {
      canvasUrl: true,
      imgUrl: canvasUrl,
      estado: 1, // 0: finalizado, 1: en revisión, 2: incida
    });

    return editOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const addComment = async (id, message) => {
  try {
    const editOrden = await store.put(table, {user: id}, {message});

    return editOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const getCanvasOrden = async (id) => {
  try {
    const getOrden = await store.get(table, {
      user: id,
    });
    if (!getOrden[0] || !getOrden[0].canvasUrl) {
      return {canvas: false};
    }

    return {
      canvas: true,
      data: getOrden[0].imgUrl,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const getOrdenes = async () => {
  try {
    const getOrdenes = await store.get(table, {});

    return getOrdenes;
  } catch (err) {
    throw new Error(err);
  }
};

const getOrden = async (id) => {
  try {
    const getOrden = await store.get(table, {
      user: id,
    });

    return getOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const getOrdenTerminadas = async (id) => {
  try {
    const getOrden = await store.get('ordenesTerminadas', {
      user: id,
    });

    return getOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const editOrden = async (id, data) => {
  try {
    const editOrden = await store.put(table, {user: id}, data);

    return editOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const cancelOrden = async (id) => {
  try {
    const getOrden = await store.get(table, {
      user: id,
    });
    if (!getOrden[0]) {
      return {message: 'order already deleted or does not exist'};
    } else {
      await store.delt(table, {user: id});
      return {message: 'cancel successfully'};
    }
  } catch (err) {
    throw new Error(err);
  }
};

const terminarOrden = async (id, pagado, correo = false, comment) => {
  try {
    // crea los cartones
    const orden = await store.get(table, {user: id});

    if (!orden[0]) {
      throw new Error('orden terminada');
    }

    const cartones = [];
    let cantidadCartonesNuevos = 0;
    await orden[0].compra.map(async (e)=>{
      cantidadCartonesNuevos = cantidadCartonesNuevos + e.cantidad;
      for (let i=1; i<= e.cantidad; i++) {
        const currentCarton = await cartonesService.createCarton(id, e.serie);
        cartones.push(currentCarton);
      }
    });

    // mover la orden
    const evento = await eventoService.get();
    await eventoService.editEvento({
      montoTotal: evento.montoTotal + pagado,
      catonesComprados: evento.catonesComprados + cantidadCartonesNuevos,
    });
    const newOrdenEnd = await store.post('ordenesTerminadas', {
      compra: orden[0].compra,
      pago: orden[0].totalPago,
      pagado,
      comment,
      user: id,
    });
    await store.delt(table, {user: id});

    // manda el correo con los pdfs
    if (correo) {
      sendConfirmationEmail(id, cartones, orden[0].compra);
    }

    refreshService(id);

    // retornar
    return newOrdenEnd;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createOrden,
  addCanvasUrl,
  getCanvasOrden,
  getOrdenes,
  getOrden,
  editOrden,
  cancelOrden,
  terminarOrden,
  addComment,
  getOrdenTerminadas,
};
