const store = require('../libs/mongoose');
const cartonesService = require('./cartones');
const eventoService = require('./evento');
const refreshService = require('./refresh');
const shortid = require('shortid');
const userService = require('./users');

const {sendConfirmationEmail, massageOrden} = require('./correo');

const table = 'ordenes';

const createOrden = async (
    compra, // Array
    totalPago, // Number
    tipoDePago, // String
    user, // String
    username, // String
    referido,
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
      referido,
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

    refreshService(orden[0].user);

    return editOrden;
  } catch (err) {
    throw new Error(err);
  }
};

const addComment = async (id, message) => {
  try {
    const editOrden = await store.put(table, {user: id}, {message});
    const user = await userService.getUserById(id);

    massageOrden(user, message);

    refreshService(id);

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
    refreshService(id);

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

      refreshService(id);
      return {message: 'cancel successfully'};
    }
  } catch (err) {
    throw new Error(err);
  }
};

const terminarOrden = async (id, pagado, correo = false, comment, adminId) => {
  try {
    // crea los cartones
    const orden = await store.get(table, {user: id});
    const [serie0] = await store.get('catalogos', {serie: 0});

    if (!orden[0]) {
      throw new Error('orden terminada');
    }

    const cartones = [];
    let cantidadCartonesNuevos = 0;
    // console.log(orden[0]);
    orden[0].compra = orden[0].compra.map((e)=>{
      if (e.serie === 0) {
        return serie0.promo.map((g)=>{
          // console.log(g);
          return {serie: g.serie, cantidad: g.cantidad * e.cantidad};
        });
      }
      return e;
    }).flat();

    // console.log('[orden]: ', orden[0].compra);

    await orden[0].compra.map(async (e)=>{
      // console.log(e);
      Array(e.cantidad).fill('', 0, e.cantidad).map(async (o, index)=>{
        const currentCarton = await cartonesService
            .createCarton(
                id, e.serie, cantidadCartonesNuevos + index, orden[0].code,
            );
        cartones.push(currentCarton);
      });
      cantidadCartonesNuevos = cantidadCartonesNuevos + e.cantidad;
    });
    //   await orden[0].compra.map(async (e)=>{
    //   if (e.serie === 0) { // <- Promo
    //     await e.promo.map( async (p) => {
    // eslint-disable-next-line max-len
    //        cantidadCartonesNuevos = cantidadCartonesNuevos + (p.cantidad * e.cantidad);
    //       for (let i=1; i<= (p.cantidad * e.cantidad); i++) {
    //         const currentCarton = await cartonesService
    //             .createCarton(id, p.serie);
    //         cartones.push(currentCarton);
    //       }
    //     });
    //   } else {
    //     cantidadCartonesNuevos = cantidadCartonesNuevos + e.cantidad;
    //     for (let i=1; i<= e.cantidad; i++) {
    // eslint-disable-next-line max-len
    //       const currentCarton = await cartonesService.createCarton(id, e.serie);
    //       cartones.push(currentCarton);
    //     }
    //   }
    // });

    // contabilidad
    const evento = await eventoService.get();
    await eventoService.editEvento({
      montoTotal: (evento.montoTotal + pagado),
      catonesComprados: (evento.catonesComprados + cantidadCartonesNuevos),
    });
    // mover la orden
    const newOrdenEnd = await store.post('ordenesTerminadas', {
      compra: orden[0].compra,
      pago: orden[0].totalPago,
      referido: orden[0].referido,
      code: orden[0].code,
      pagado,
      comment,
      endBy: adminId,
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
