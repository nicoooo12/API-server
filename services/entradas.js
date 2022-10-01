const store = require('../libs/mongoose');
// const config = require('../config');
const table = 'entradas';

const getCountEntradas = async () => {
  try {
    const getEntradas = await store.count(table);
    return getEntradas;
  } catch (error) {
    throw new Error(error);
  }
};

const getEntradaByUser = async (user) => {
  try {
    const getEntrada = await store.get(table, {user});
    return {err: false, getEntrada};
  } catch (error) {
    throw new Error(error);
  }
};

const createEntrada = async (user) => {
  try {
    const entradas = await getCountEntradas();
    const entrada = await store.get(table, {user});
    if (entrada[0]) {
      return {err: true};
    }
    if (entradas >= 200) {
      return {err: true, message: 'agotadas'};
    }

    try {
      await axios({
        method: 'post',
        url: `${config.ssrUrl}/sockets/entrada`,
      });
    } catch (error) {
    }

    const createEntrada = await store.post(
        table, {user},
    );
    return {err: false, createEntrada};
  } catch (error) {
    throw new Error(error);
  }
};

const ocuparEntrada = async (id) => {
  try {
    const entrada = await store.get(table, {_id: id});
    if (entrada[0]) {
      return {err: true};
    }

    const change = await store.put(talble, {_id, id}, {use: true});

    try {
      await axios({
        method: 'post',
        url: `${config.ssrUrl}/sockets/entrada`,
      });
    } catch (error) {
    }
    return change;
  } catch (error) {
    throw new Error(error);
  }
};

const deletedEntrada = async (user) => {
  try {
    const getEntrada = await store.get(table, {user});

    if (!getEntrada[0]) {
      return {message: 'carton already deleted or does not exist'};
    } else {
      await store.delt(table, {user});
      return {message: 'deleted successfully'};
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getEntradaByUser,
  getCountEntradas,
  createEntrada,
  deletedEntrada,
  ocuparEntrada,
};
