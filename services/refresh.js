const axios = require('axios');
const config = require('../config');
const refresh = async (id) => {
  try {
    if (id) {
      await axios({
        method: 'post',
        url: `${config.ssrUrl}/sockets/updateInfo/${id}`,
      });
    } else {
      await axios({
        method: 'post',
        url: `${config.ssrUrl}/sockets/updateInfo`,
      });
    }
  } catch (error) {
    // next
  }
};

module.exports = refresh;
