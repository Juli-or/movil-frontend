import React, { useEffect, useState } from "react";
import "../style/Oferta.css";
import { FaShoppingCart, FaTag, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    fetch("http://localhost:4000/api/ofertas")
      .then((res) => res.json())
      .then((data) => setOfertas(data))
      .catch((err) => console.error(" Error cargando ofertas:", err));


    fetch("http://localhost:4000/api/descuentos/activos")
      .then((res) => res.json())
      .then((data) => setDescuentos(data))
      .catch((err) => console.error("Error cargando descuentos:", err));
  }, []);


  const handleRedimir = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/descuentos/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      setMensajeCodigo(data.mensaje || "Error al validar código");
    } catch (error) {
      setMensajeCodigo("Error en el servidor");
    }
  };

  return (
    <div className="ofertas-page">
      <h1 className="ofertas-page-title">Ofertas Especiales</h1>


      <div className="ofertas-news">
        <h2><FaTag style={{ marginRight: "6px", color: "#ff9800" }} /> Últimas noticias</h2>
        <ul>
          <li>Descuentos especiales durante el mes.</li>
          {descuentos.map((d, index) => (
            <li key={index}>
              <FaTag style={{ marginRight: "6px", color: "#ff9800" }} />
              Código: <strong>{d.codigo_descuento}</strong> ({d.nombre_descuento})
            </li>
          ))}
        </ul>
      </div>


      <div className="codigo-descuento-box">
        <input
          type="text"
          placeholder="Ingresa tu código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button onClick={handleRedimir}>
          <FaTag style={{ marginRight: "6px" }} />
          Redimir
        </button>
      </div>
      {mensajeCodigo && (
        <p style={{ textAlign: "center", marginBottom: "1rem", color: "#ff9800" }}>
          {mensajeCodigo}
        </p>
      )}


      <div className="ofertas-grid">
        {ofertas.map((oferta) => {
          const precioConDescuento = oferta.descuento_porcentaje
            ? oferta.precio_unitario - (oferta.precio_unitario * oferta.descuento_porcentaje) / 100
            : oferta.precio_unitario;

          return (
            <div key={oferta.id_oferta} className="oferta-card">
              <img src={oferta.url_imagen} alt={oferta.nombre_producto} />

              <div className="oferta-card-content">
                <h3 className="oferta-card-title">{oferta.nombre_producto}</h3>
                <p className="oferta-card-description">{oferta.descripcion_producto}</p>

                <p className="oferta-card-precio">
                  {oferta.descuento_porcentaje ? (
                    <>
                      <span className="precio-original">${oferta.precio_unitario}</span>
                      <span className="precio-descuento">${precioConDescuento.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${oferta.precio_unitario}</span>
                  )}
                </p>
              </div>

              <div className="oferta-card-footer">
                <button className="oferta-btn oferta-btn-carrito">
                  <FaShoppingCart style={{ marginRight: "6px" }} />
                  Agregar
                </button>
                <button
                  className="oferta-btn oferta-btn-comprar"
                  onClick={() => navigate(`/producto/${oferta.id_producto}`)}
                >
                  <FaCreditCard style={{ marginRight: "6px" }} />
                  ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
