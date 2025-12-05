import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductDetail from "../components/ProductDetail";

const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando producto:", err);
        setError("No se pudo cargar el producto.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: "20px" }}>Cargando producto...</p>;
  if (error) return <p style={{ padding: "20px" }}>{error}</p>;

  return (
    <div>
      {product ? (
        <ProductDetail product={product} />
      ) : (
        <p style={{ padding: "20px" }}>Producto no encontrado</p>
      )}
    </div>
  );
};

export default ProductPage;
