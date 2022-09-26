const bcrypt = require('bcrypt');
const collection = 'users';
const store = require('../libs/mongoose');
// const boom = require('@hapi/boom');
const shortid = require('shortid');

const getUser = async ({email}) => {
  const [user] = await store.get(collection, {email});
  return user;
};

const getUserById = async (id) => {
  const [user] = await store.get(collection, {_id: id});
  return user;
};

const changePasswordRequest = async (email) => {
  const user = await getUser({email});
  if (!user) {
    return {
      err: true,
      message: 'not exist',
    };
  }

  const code = shortid.generate();

  await updateUser(user._id, {changePassword: code});

  return {
    err: false,
    user,
    code,
  };
};

const changePassword = async (email, code, password) => {
  const user = await getUser({email});
  if (!user) {
    return {
      err: true,
      message: 'not exist',
    };
  }

  if (user.changePassword !== code) {
    return {
      err: true,
      message: 'unauthorised',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUser(user._id, {changePassword: '', password: hashedPassword});

  return {
    err: false,
  };
};

const createUser = async ({user}) => {
  const {name, email, password} = user;
  const queriedUser = await getUser({email});


  if (queriedUser) {
    return {
      err: true,
      message: 'busy account',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUser = await store.post(collection, {
    name,
    email,
    password: hashedPassword,
  });

  return {
    err: false,
    data: createUser._id,
  };
};

const updateUser = async (id, data) => {
  const updateUser = await store.put(collection, {_id: id}, data);

  return {
    name: updateUser[0].name,
    email: updateUser[0].email,
  };
};

module.exports = {
  getUserById,
  changePassword,
  createUser,
  getUser,
  updateUser,
  changePasswordRequest,
};
