const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchemaUsers = new Schema({
  name: String,
  email: String,
  // telefono: Number,
  password: String,
  isAdmin: Boolean,
});

const mySchemaCartones = new Schema({
  user: String,
  title: String,
  data: Array,
  serie: Number,
});

const mySchemaCatalogos = new Schema({
  premios: Array,
  titulo: String,
  subTitulo: String,
  precio: Number,
  enVenta: Boolean,
  serie: Number,
  color: String,
  icon: String,
});

const mySchemaOrdenes = new Schema({
  compra: Array,
  totalPago: Number,
  tipoDePago: String,
  estado: Number, // 0: finalizado, 1: en revisión, 2: iniciada
  canvasUrl: Boolean,
  imgUrl: String,
  user: String,
  username: String,
  message: String,
  code: String,
  fecha: {
    type: Date,
    default: function() {
      return Date.now();
    },
  },
});

const mySchemaOrdenesTerminadas = new Schema({
  compra: Array,
  pago: Number,
  pagado: Number,
  user: String,
  comment: String,
  code: String,
  fecha: {
    type: Date,
    default: function() {
      return Date.now();
    },
  },
});

const mySchemaEvento = new Schema({
  montoTotal: Number,
  catonesComprados: Number,
  fecha: String,
  superUsuario: String,
});

const mySchemaPlay = new Schema({
  estado: Number,
  serieJuego: Number,
  comment: String,
});

const mySchemaErrores = new Schema({
  type: String,
  stack: String,
  url: String,
  user: Object,
});


const mySchemaNotification = new Schema({
  title: String,
  body: String,
  for: Array,
  read: Array,
});

const users = mongoose.model('users', mySchemaUsers);//*
const cartones = mongoose.model('cartones', mySchemaCartones);//*
const ordenes = mongoose.model('ordenes', mySchemaOrdenes);//*
const ordenesTerminadas = mongoose.model(
    'ordenesTerminadas',
    mySchemaOrdenesTerminadas,
);//*

const catalogos = mongoose.model('catalogos', mySchemaCatalogos);//*

const plays = mongoose.model('plays', mySchemaPlay);
const evento = mongoose.model('evento_s', mySchemaEvento);
const errores = mongoose.model('errores', mySchemaErrores);
const notification = mongoose.model('notification', mySchemaNotification);

module.exports = {
  users,
  plays,
  catalogos,
  cartones,
  ordenes,
  evento,
  errores,
  ordenesTerminadas,
  notification,
};
