const jwt = require('jsonwebtoken')

// Verifica que el usuario esté logueado
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No autorizado' })

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Verifica que sea admin
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') 
    return res.status(403).json({ error: 'Solo admins' })
  next()
}

module.exports = { verificarToken, soloAdmin }