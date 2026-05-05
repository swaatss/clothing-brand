require('dotenv').config()
require('./db')

const express = require('express')
const cors = require('cors')
const { verificarToken, soloAdmin } = require('./Middleware/auth')
const Producto = require('./models/Producto')
const Carrito = require('./models/Carrito')

// Obtener carrito del usuario
app.get('/api/carrito', verificarToken, async (req, res) => {
  const carrito = await Carrito.findOne({ usuario: req.usuario.id })
  res.json(carrito ? carrito.items : [])
})

// Guardar carrito completo
app.post('/api/carrito', verificarToken, async (req, res) => {
  const { items } = req.body
  const carrito = await Carrito.findOneAndUpdate(
    { usuario: req.usuario.id },
    { items },
    { upsert: true, new: true }
  )
  res.json(carrito.items)
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/images', express.static('public/images'))

// Cualquiera puede ver productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.find()
  res.json(productos)
})

// Solo admins pueden crear, editar, borrar
app.post('/api/productos', verificarToken, soloAdmin, async (req, res) => {
  const producto = new Producto(req.body)
  await producto.save()
  res.json(producto)
})

app.put('/api/productos/:id', verificarToken, soloAdmin, async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(producto)
})

app.delete('/api/productos/:id', verificarToken, soloAdmin, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id)
  res.json({ message: 'Eliminado' })
})

app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})