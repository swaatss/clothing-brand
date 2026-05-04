const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  color: String,
  sizes: [String],
  descripcion: String,
  imagen: String,
  stock: { type: Number, default: 0 }
})

module.exports = mongoose.model('Producto', productoSchema)