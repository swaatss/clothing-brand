require('dotenv').config()
require('./db')
const Producto = require('./models/Producto')

const productos = [
  {
    nombre: "Stacking Baggy Jeans",
    precio: 99.99,
    color: "Asphalt Gray",
    sizes: ["S", "M", "L", "XL"],
    descripcion: "Relaxed fit with stacking length.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/stacking baggy jeans.jpg"
  },
  {
    nombre: "Baggy Jeans",
    precio: 79.99,
    color: "Light Wash",
    sizes: ["S", "M", "L", "XL"],
    descripcion: "Classic wide-leg silhouette.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/baggy jeans.jpg"
  },
  {
    nombre: "Black Baggy Jeans",
    precio: 84.99,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    descripcion: "All-black heavyweight denim.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/black baggy jeans.jpg"
  },
  {
    nombre: "Cammo Baggy Jeans",
    precio: 84.99,
    color: "Camo Green",
    sizes: ["M", "L", "XL"],
    descripcion: "Military-inspired camo print.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/camo baggy pants.jpg"
  },
  {
    nombre: "Darkblue Baggy Jeans",
    precio: 84.99,
    color: "Dark Indigo",
    sizes: ["S", "M", "L", "XL"],
    descripcion: "Deep indigo wash.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/darkblue baggy jeans.jpg"
  },
  {
    nombre: "Baggy Cargo",
    precio: 84.99,
    color: "Olive",
    sizes: ["S", "M", "L", "XL", "XXL"],
    descripcion: "Utility pockets with relaxed drape.",
    imagen: "https://clothing-brand-production-ff3f.up.railway.app/images/baggy cargo.jpg"
  },
]

Producto.insertMany(productos)
  .then(() => {
    console.log('✓ Productos subidos a MongoDB')
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })