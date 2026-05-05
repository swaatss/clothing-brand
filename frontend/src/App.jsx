import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Login from './login';
import './App.css';

// --- 1. COMPONENTE DE LA PÁGINA PRINCIPAL ---
const Home = ({ productos, onAddToCart }) => {
  const navigate = useNavigate();
  return (
    <main className="product-grid">
      {productos.map((p) => (
        <div key={p._id} className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
          <img src={p.imagen} alt={p.nombre} />
          <div className="product-info">
            <h3>{p.nombre}</h3>
            <p className="price">${p.precio.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </main>
  );
};

// --- 2. COMPONENTE DE DETALLE ---
const ProductDetail = ({ productos, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = productos.find((item) => item._id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  if (!producto) return (
    <div className="detalle-container error-state">
      <h1>Product not found</h1>
      <button onClick={() => navigate('/')}>← Back to store</button>
    </div>
  );

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    onAddToCart({ ...producto, selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detalle-container">
      <div className="detalle-content">
        <div className="detalle-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">${producto.precio.toFixed(2)}</p>

          {/* Color now comes from product data */}
          {producto.color && (
            <p className="detalle-color-label">Color: {producto.color}</p>
          )}

          {/* Sizes now come from product data */}
          <select
            className="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Select size</option>
            {(producto.sizes || ['S', 'M', 'L', 'XL']).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button className={`add-bag-btn ${added ? 'added' : ''}`} onClick={handleAddToBag}>
            {added ? '✓ ADDED TO BAG' : 'ADD TO SHOPPING BAG'}
          </button>

          <div className="detalle-extra-info">
            <p>Find in store</p>
            <p>{producto.descripcion || 'Product details'}</p>
            <p>Free shipping and returns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. CARRITO ---
const Cart = ({ cart, onRemove, onClose }) => {
  const total = cart.reduce((sum, item) => sum + item.precio, 0);
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>YOUR BAG</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        {cart.length === 0 ? (
          <p className="cart-empty">Your bag is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item, i) => (
                <li key={i} className="cart-item">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.nombre}</p>
                    <p className="cart-item-size">Size: {item.selectedSize}</p>
                    <p className="cart-item-price">${item.precio.toFixed(2)}</p>
                  </div>
                  <button className="cart-remove" onClick={() => onRemove(i)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <p className="cart-total">TOTAL: ${total.toFixed(2)}</p>
              <button className="checkout-btn">CHECKOUT</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- 4. HEADER con navigate en lugar de window.location.href ---
const Header = ({ cartCount, onCartOpen, token, onLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="main-header">
      <button className="cart-icon-btn" onClick={token ? onLogout : () => navigate('/login')}>
        {token ? 'SIGN OUT' : 'SIGN IN'}
      </button>

      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Bond
      </h1>

      <button className="cart-icon-btn" onClick={onCartOpen}>
        BAG {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </header>
  );
};
  
// --- 5. FUNCIÓN PRINCIPAL ---
function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    fetch('https://clothing-brand-production-ff3f.up.railway.app/api/productos')
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Could not connect to the server. Please make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };
  const handleLogout = () => {
  localStorage.removeItem('token');
  setToken(null);
};

  return (
    <Router>
      <ScrollToTop />
      <div className="container">
       <Header cartCount={cart.length} onCartOpen={() => setCartOpen(true)} token={token} onLogout={handleLogout} />

        {/* Loading state */}
        {loading && (
          <div className="status-screen">
            <div className="loader"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="status-screen error">
           <p>SERVER IS DOWN</p>
          </div>
        )}

        {/* Normal app routes */}
        {!loading && !error && (
          <Routes>
            <Route path="/" element={<Home productos={productos} onAddToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ProductDetail productos={productos} onAddToCart={handleAddToCart} />} />
            <Route path="/login" element={<Login onLogin={setToken} />} />
          </Routes>
        )}

        {/* Cart drawer */}
        {cartOpen && (
          <Cart
            cart={cart}
            onRemove={handleRemoveFromCart}
            onClose={() => setCartOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
