const store = require('../libs/mongoose');


// const config = require('../config');
const table = 'codes';

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
  getCodeByUser,
  getCodeByCode,
  createCodes,
  deletedCodes,
  markAsActive,
};
