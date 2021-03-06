const store = require('../libs/mongoose');
const table = 'plays';
// const boom = require('@hapi/boom')

const updatePlay = async (data) => {
  try {
    const idPlay = await store.get(table, {});
    const editCatalogo = await store.put(
        table,
        {_id: idPlay[0]._id},
        data,
    );

    return editCatalogo;
  } catch (err) {
    throw new Error(err);
  }
};

const getPlay = async () => {
  try {
    const getPlay = await store.get(table, {});

    return getPlay[0];
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  updatePlay,
  getPlay,
};
