const db = require('mongoose');
const debugApp = require('debug')('app:DB');

db.Promise = global.Promise;

const connect = async (url) => {
  await db.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    debugApp('DB conectado correctamente');
  }) .catch((err)=>{
    debugApp('-error-  ', err);
  });
};

module.exports = connect;
