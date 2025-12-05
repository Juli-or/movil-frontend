import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBox,
  FaStar,
  FaHome,
  FaShoppingBag,
  FaBlog,
  FaTag,
  FaUserPlus,
  FaSignInAlt,
  FaUserCircle
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

function Navbar({ isAuthenticated, user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isCliente = user?.id_rol === 1;

  const userImage = user?.imagen || "/images/user.jpg";

  // Función para obtener el número de items del carrito
  const fetchCartItemsCount = async () => {
    if (!isAuthenticated || !isCliente) return;

    try {
      const response = await fetch(`http://localhost:4000/api/carrito/numero-items/${user.id_usuario}`);
      const data = await response.json();

      if (data.success) {
        setCartItemsCount(data.data);
      }
    } catch (error) {
      console.error("Error obteniendo número de items del carrito:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isCliente) {
      fetchCartItemsCount();

      // Actualizar cada 30 segundos (opcional)
      const interval = setInterval(fetchCartItemsCount, 30000);
      return () => clearInterval(interval);
    } else {
      setCartItemsCount(0);
    }
  }, [isAuthenticated, user, isCliente]);

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
    setCartItemsCount(0); // Resetear contador al cerrar sesión
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/img/1.png"
          alt="AgroSoft Logo"
          style={{ width: "50px", height: "50px", marginRight: "8px" }}
        />
        <span className="brand-text">
          Agro<span className="highlight">Soft</span>
        </span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto nav-links">
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center ${location.pathname === "/" ? "active" : ""}`}
              to="/"
            >
              <FaHome className="nav-icon me-2" />
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center ${location.pathname === "/catalogo" ? "active" : ""}`}
              to="/catalogo"
            >
              <FaShoppingBag className="nav-icon me-2" />
              Catálogo
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center ${location.pathname === "/blog" ? "active" : ""}`}
              to="/blog"
            >
              <FaBlog className="nav-icon me-2" />
              Blog
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center ${location.pathname === "/ofertas" ? "active" : ""}`}
              to="/ofertas"
            >
              <FaTag className="nav-icon me-2" />
              Ofertas
            </Link>
          </li>

          {isAuthenticated && isCliente && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center ${location.pathname === "/mis-pedidos" ? "active" : ""}`}
                  to="/Pedidos"
                >
                  <FaBox className="nav-icon me-2" />
                  Mis Pedidos
                </Link>
              </li>

            </>
          )}
        </ul>

        <div className="d-flex align-items-center">
          {isAuthenticated && isCliente && (
            <Link to="/carrito" className="nav-link position-relative me-3 cart-link">
              <FaShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-dropdown">
              <button
                className="btn user-btn d-flex align-items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                {user?.imagen ? (
                  <img
                    src={userImage}
                    alt="Perfil"
                    className="user-avatar"
                  />
                ) : (
                  <FaUserCircle className="user-avatar-icon" size={28} />
                )}
              </button>

              {showDropdown && (
                <div className="dropdown-menu-custom">
                  <div className="dropdown-header">
                    <FaUserCircle size={40} className="mb-2" />
                    <p className="dropdown-username mb-1">
                      Hola, <strong>{user?.nombre || user?.email?.split('@')[0]}</strong>
                    </p>
                    <small className="dropdown-email">{user?.email}</small>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/perfil"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUser className="me-2" />
                    Mi Perfil
                  </Link>

                  <Link
                    to="/mis-pedidos"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaBox className="me-2" />
                    Mis Pedidos
                  </Link>

                  <Link
                    to="/Pedidos"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaStar className="me-2" />
                    Mis Reseñas
                  </Link>

                  <Link
                    to="/carrito"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaShoppingCart className="me-2" />
                    Mi Carrito {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </Link>

                  <Link
                    to="/configuracion"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaCog className="me-2" />
                    Configuración
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item d-flex align-items-center logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons d-flex align-items-center">
              <Link
                to="/login"
                className="nav-link d-flex align-items-center me-3 login-link"
              >
                <FaSignInAlt className="me-2" />
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="nav-link d-flex align-items-center register-link"
              >
                <FaUserPlus className="me-2" />
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;