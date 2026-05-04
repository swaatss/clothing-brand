const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

// Registro
router.post('/register', async (req, res) => {
  try {
    const usuario = new Usuario(req.body)
    await usuario.save()
    res.json({ message: 'Usuario creado' })
  } catch (err) {
    res.status(400).json({ error: 'Email ya existe' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ email: req.body.email })
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' })

    const passwordOk = await bcrypt.compare(req.body.password, usuario.password)
    if (!passwordOk) return res.status(401).json({ error: 'Credenciales inválidas' })

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' })
  }
})

module.exports = router