const store = require('../libs/mongoose');

const getAdminData = async () => {
  const [
    ordenes,
    totalOrdenesTerminadas,
    codesCanjeados,
    cartonesComprados,
    [recaudado],
  ] = await Promise.all([
    store.get('ordenes', {}),
    store.count('ordenesTerminadas', {}),
    store.count('codes', {active: /(.)+/}),
    store.count('cartones', {}),
    store.get('evento', {}),
  ]);

  return {
    ordenes,
    totalOrdenesTerminadas,
    codesCanjeados,
    cartonesComprados,
    recaudado: recaudado.montoTotal,
  };
};

module.exports = {
  getAdminData,
};
