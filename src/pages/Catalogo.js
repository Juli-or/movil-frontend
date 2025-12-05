import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Slideshow2 from "../components/Slideshow2";
import ProductCard from "../components/ProductCard";
import CatalogNav from "../components/CatalogNav";
import SearchBar from "../components/SearchBar";
import { useCarrito } from "../context/CarritoContext";
import { useNotification } from "../context/NotificationContext";
import "../style/Catalogo.css";

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");
  const user = isAuthenticated ? JSON.parse(localStorage.getItem("user")) : null;

  // Usar el contexto del carrito y notificaciones
  const { agregarAlCarrito } = useCarrito();
  const { addNotification } = useNotification();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => {
        console.log("Respuesta completa:", res);
        console.log("res.data:", res.data);

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (res.data && Array.isArray(res.data.result)) {
          setProducts(res.data.result);
        } else {
          console.warn("Estructura de datos inesperada:", res.data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
        setProducts([]);
      });
  }, []);

  // Función para agregar producto al carrito CON NOTIFICACIONES
  const handleAddToCart = async (productId) => {
    console.log('🛒 Iniciando handleAddToCart para producto:', productId);

    if (!isAuthenticated || !user) {
      addNotification('Por favor inicia sesión para agregar productos al carrito', 'warning');
      navigate("/login");
      return;
    }

    // Verificar si el usuario es cliente
    if (user.id_rol !== 1) {
      addNotification('Solo los clientes pueden agregar productos al carrito', 'warning');
      return;
    }

    console.log('👤 Usuario válido:', user.nombre_usuario);
    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      console.log('🔄 Llamando a agregarAlCarrito...');
      // Usar la función del contexto del carrito
      await agregarAlCarrito(productId, 1);

      // Mostrar notificación de éxito
      const product = products.find(p => p.id_producto === productId);
      addNotification(`¡${product?.nombre_producto} agregado al carrito correctamente!`, 'success');
      console.log(' Producto agregado exitosamente');

    } catch (error) {
      console.error(" Error en handleAddToCart:", error);

      let errorMessage = "Error inesperado al agregar al carrito";

      if (error.response) {
        // Error del servidor
        errorMessage = error.response.data?.error || errorMessage;
        console.error('📊 Detalles del error del servidor:', error.response.data);
      } else if (error.request) {
        // Error de conexión
        errorMessage = "Error de conexión. Por favor, verifica tu internet.";
        console.error('🌐 Error de conexión:', error.request);
      } else if (error.message) {
        // Error del contexto
        errorMessage = error.message;
        console.error('💬 Mensaje de error:', error.message);
      }

      // Mostrar notificación de error
      addNotification(errorMessage, 'error');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Función para ver producto
  const handleViewProduct = (productId) => {
    navigate(`/producto/${productId}`);
  };

  // Filtrar productos basado en la búsqueda
  const filteredProducts = products.filter(product =>
    product.nombre_producto?.toLowerCase().includes(search.toLowerCase()) ||
    product.descripcion_producto?.toLowerCase().includes(search.toLowerCase()) ||
    product.nombre_categoria?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Slideshow2 />
        <div className="catalogo-section-title">
          <h2 className="catalogo-title-animated">Catálogo de productos</h2>
        </div>
        <CatalogNav />
        <SearchBar onSearch={setSearch} />
        <main className="catalogo-container">
          <div className="catalogo-loading">
            <FaShoppingCart className="loading-icon" />
            <p>Cargando productos...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Slideshow2 />

      <div className="catalogo-section-title">
        <h2 className="catalogo-title-animated">Catálogo de productos</h2>
        {isAuthenticated && user?.id_rol === 1 && (
          <p className="catalogo-subtitle">
            Descubre nuestros productos frescos y agrega tus favoritos al carrito
          </p>
        )}
      </div>

      <CatalogNav />
      <SearchBar onSearch={setSearch} />

      <main className="catalogo-container">
        {/* Información de resultados */}
        <div className="catalogo-info-bar">
          <span className="catalogo-product-count">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </span>
          {search && (
            <span className="catalogo-search-term">
              Búsqueda: "{search}"
            </span>
          )}
        </div>

        <div className="catalogo-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id_producto}
                id={product.id_producto}
                image={product.url_imagen}
                title={product.nombre_producto}
                description={product.descripcion_producto || "Sin descripción disponible"}
                producer={product.productor || product.nombre_usuario || "Agrosoft"}
                price={product.precio_unitario}
                stock={product.estado_producto === "Activo" && product.cantidad > 0 ? "Disponible" : "Agotado"}
                available={product.cantidad || 0}
                isAuthenticated={isAuthenticated}
                onAddToCart={() => handleAddToCart(product.id_producto)}
                onWriteReview={() => handleViewProduct(product.id_producto)}
                unidad_medida={product.unidad_medida}
                addingToCart={addingToCart[product.id_producto]}
              />
            ))
          ) : (
            <div className="catalogo-no-products">
              <FaShoppingCart size={48} className="no-products-icon" />
              <h3>No se encontraron productos</h3>
              <p>
                {search
                  ? `No hay productos que coincidan con "${search}"`
                  : "No hay productos disponibles en este momento"
                }
              </p>
              {search && (
                <button
                  className="catalogo-clear-search"
                  onClick={() => setSearch("")}
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>

        {/* Botón para ir al carrito si hay productos */}
        {isAuthenticated && user?.id_rol === 1 && filteredProducts.length > 0 && (
          <div className="catalogo-cart-cta">
            <button
              className="catalogo-go-to-cart-btn"
              onClick={() => navigate("/carrito")}
            >
              <FaShoppingCart />
              Ver mi carrito
            </button>
          </div>
        )}

        {/* Botón volver */}
        <section className="catalogo-volver-container">
          <button className="catalogo-volver-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Volver
          </button>
        </section>
      </main>
    </>
  );
};

export default Catalogo;