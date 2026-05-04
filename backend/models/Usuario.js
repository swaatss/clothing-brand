const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'cliente'], default: 'cliente' }
})

// Encripta la password antes de guardar
usuarioSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  }
})

module.exports = mongoose.model('Usuario', usuarioSchema)