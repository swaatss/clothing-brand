const mongoose = require('mongoose')

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  items: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      nombre: String,
      precio: Number,
      imagen: String,
      selectedSize: String,
    }
  ]
})

module.exports = mongoose.model('Carrito', carritoSchema)