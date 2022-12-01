const data = {
  cartones: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      data: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      user: '637e4928a9415a0016f9b6a9',
      title: 'Verde',
      serie: 2,
      code: '00001',
    },
  ],
  catalogo: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      premios: [],
      titulo: 'Amarillo',
      subTitulo: ' ',
      precio: 5,
      enVenta: true,
      serie: 1,
      color: '#ffd65f',
      icon: '🍊',
      icon_img: 'bla bla bla',
    },
  ],
  eventos_s: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      montoTotal: 0,
      catonesComprados: 6,
      fecha: 'Sábado 1 de octubre a las 15hrs (cl)',
      pago: [],
      contacto: [],
      subTitle: 'testing are so boring',
      title: 'Testing',
      naciones: [
        {
          name: 'Chile',
          moneda: 'CLP',
          simbolo: '$',
          cambio: '1000',
          fecha: 'Sábado 1 de octubre',
        },
      ],
    },
  ],
  ordenes: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      compra: [
        {serie: 1, cantidad: 1},
        {serie: 2, cantidad: 1},
      ],
      code: 'PhMFve74e',
      totalPago: 5,
      tipoDePago: 'transferencia',
      username: 'tester',
      estado: 2,
      canvasUrl: false,
      user: '637e4928a9415a0016f9b6a9',
      fechas: '2022-11-25T16:32:44.410+00:00',
    },
  ],
  ordenesterminadas: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      compra: [
        {serie: 1, cantidad: 1},
        {serie: 2, cantidad: 1},
      ],
      pago: 5,
      pagado: 0,
      commnet: 'todo bien',
      endBy: '637e4928a9415a0016f9b6a9',
      user: '637e4928a9415a0016f9b6a9',
      fecha: '2022-11-25T16:32:44.410+00:00',
    },
  ],
  plays: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      estado: 0,
      serieJuego: 1,
      comment: 'Espera un poco',
    },
  ],
  users: [
    {
      _id: '637e4928a9415a0016f9b6a9',
      name: 'Nico Flores',
      password: 'securePassword',
      país: 'Chile',
      isAdmin: true,
      changePassword: 'abc',
    },
  ],
};

const get = (tabla, id) => {
  if (!Object.keys(data).includes(tabla)) {
    return {
      error: true,
    };
  }
  return {
    error: false,
    body: data[tabla],
  };
};
const put = (tabla, id, data) => {
  if (!Object.keys(data).includes(tabla)) {
    return {
      error: true,
    };
  }
  return {
    error: false,
    body: data[tabla][0],
  };
};
const post = (tabla, data) => {
  if (!Object.keys(data).includes(tabla)) {
    return {
      error: true,
    };
  }
  return {
    error: false,
    body: data[tabla][0],
  };
};
const delt = (tabla, id) => {
  return new Promise((resolve) => {
    resolve({
      error: false,
      body: 'dato eliminado',
    });
  });
};

const count = () => {
  return 1;
};

module.exports = {
  get,
  post,
  put,
  delt,
  count,
};
