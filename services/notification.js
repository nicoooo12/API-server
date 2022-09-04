const store = require('../libs/mongoose');


// const config = require('../config');
const table = 'notification';

const getNotificationByUser = async (id) => {
  const personalNotifications = await store.get(table, {for: id});
  const forAllNotifications = await store.get(table, {for: 'all'});

  const allNotification = [...personalNotifications, ...forAllNotifications];

  return {err: false, notifications: allNotification};
};

const createNotification = async (
    title, body, _for,
) => {
  try {
    const notification = await store.get(table, {title});
    if (notification[0]) {
      return {err: true};
    }
    const createNotification = await store.post(table, {title, body, _for});
    return {err: false, createNotification};
  } catch (error) {
    throw new Error(error);
  }
};

const deletedNotification = async (id) => {
  try {
    const getNotification = await store.get(table, {
      _id: id,
    });
    if (!getNotification[0]) {
      return {message: 'carton already deleted or does not exist'};
    } else {
      await store.delt(table, {
        _id: id,
      });
      return {message: 'deleted successfully'};
    }
  } catch (error) {
    throw new Error(error);
  }
};

const markAsRead = async (id, user) => {
  try {
    const getNotification = await store.put(table, {_id: id});
    const editNotification = await store.put(
        table, id, {read: [...getNotification.read, user]},
    );
    return editNotification;
  } catch (err) {
    throw new Error(err);
  }
};

exports.default = {
  getNotificationByUser,
  createNotification,
  deletedNotification,
  markAsRead,
};
