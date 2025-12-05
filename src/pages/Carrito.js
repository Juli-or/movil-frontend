import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaExclamationTriangle,
  FaFileAlt,
  FaCreditCard
} from "react-icons/fa";
import { useNotification } from "../context/NotificationContext";
import { useCarrito } from "../context/CarritoContext";
import ShippingFormModal from "../components/ShippingFormModal";
import PaymentModal from "../components/PaymentModal";
import "../style/Carrito.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Carrito = () => {
  const {
    carritoData: carritoContextData,
    actualizarCarrito,
    numeroItems,
    loading: contextLoading
  } = useCarrito();

  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [error, setError] = useState(null);

  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const usuario = JSON.parse(localStorage.getItem("user"));
  const API_URL = "http://localhost:4000/api";

  const carritoData = carritoContextData;

  useEffect(() => {
    if (usuario) {
      if (carritoData) {
        setLoading(false);
      } else {
        actualizarCarrito().finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [usuario, carritoData, actualizarCarrito]);

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "" || isNaN(price)) {
      return "$0 COP";
    }

    let numericPrice;
    if (typeof price === 'string') {
      numericPrice = parseFloat(price);
    } else {
      numericPrice = price;
    }

    if (numericPrice < 100) {
      numericPrice = numericPrice * 1000;
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericPrice);
  };

  const generarReportePDF = () => {
    if (!carritoData?.items) {
      addNotification('No hay productos en el carrito para generar reporte', 'warning');
      return;
    }

    setProcessingAction(true);

    try {

      const pdfElement = document.createElement('div');
      pdfElement.style.position = 'absolute';
      pdfElement.style.left = '-9999px';
      pdfElement.style.top = '0';
      pdfElement.style.width = '800px';
      pdfElement.style.padding = '40px';
      pdfElement.style.backgroundColor = 'white';
      pdfElement.style.fontFamily = 'Arial, sans-serif';
      pdfElement.style.color = '#333';

      // Contenido del PDF
      pdfElement.innerHTML = `
        <div id="pdf-content">
          <!-- Encabezado -->
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #28a745; padding-bottom: 20px;">
            <h1 style="color: #2d5016; margin: 0; font-size: 28px; font-weight: bold;">AGROSOFT SAS</h1>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Sistema Integral de Gestión Agrícola</p>
            <p style="color: #666; margin: 5px 0; font-size: 12px;">NIT: 901.234.567-8 • Tel: +57 1 234 5678</p>
            <p style="color: #666; margin: 5px 0; font-size: 12px;">Bogotá D.C., Colombia</p>
          </div>
          
          <!-- Información del Reporte -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #2d5016; margin: 0 0 15px 0; font-size: 20px; text-align: center;">
              REPORTE DE COTIZACIÓN
            </h2>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div>
                <strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-CO')}
              </div>
              <div>
                <strong>No. de Reporte:</strong> AG-${Date.now().toString().slice(-6)}
              </div>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Cliente:</strong> ${usuario.nombre_usuario}
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Email:</strong> ${usuario.email || 'No registrado'}
            </div>
          </div>
          
          <!-- Tabla de Productos -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px;">
            <thead>
              <tr style="background-color: #2d5016; color: white;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Producto</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Cantidad</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Unidad</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Precio Unitario</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${carritoData.items.map((item, index) => {
        let precio = item.precio_unitario_al_momento || 0;
        let subtotalItem = item.subtotal || 0;

        if (precio < 100) precio = precio * 1000;
        if (subtotalItem < 100) subtotalItem = subtotalItem * 1000;

        return `
                  <tr style="${index % 2 === 0 ? 'background-color: #f8f9fa;' : ''}">
                    <td style="border: 1px solid #ddd; padding: 10px;">
                      <strong>${item.nombre_producto}</strong><br>
                      <small style="color: #666;">${item.descripcion_producto}</small>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.cantidad}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.unidad_medida}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${formatPrice(precio)}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${formatPrice(subtotalItem)}</td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
          
          <!-- Totales -->
          <div style="margin-left: auto; width: 300px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Envío:</span>
              <span style="color: #28a745;">GRATIS</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding-top: 10px; border-top: 2px solid #ea8006;">
              <span>TOTAL:</span>
              <span style="color: #28a745;">${formatPrice(subtotal)}</span>
            </div>
          </div>
          
          <!-- Información Adicional -->
          <div style="border-top: 2px solid #ea8006; padding-top: 20px; margin-bottom: 30px;">
            <h3 style="color: #2d5016; margin-bottom: 10px; font-size: 16px;">Términos y Condiciones</h3>
            <ul style="color: #666; font-size: 11px; line-height: 1.4; margin: 0; padding-left: 15px;">
              <li>Este documento es una cotización y no constituye una factura oficial.</li>
              <li>Los precios están expresados en Pesos Colombianos (COP).</li>
              <li>Válido por 15 días a partir de la fecha de emisión.</li>
              <li>El envío gratuito aplica para compras mayores a $50,000 COP en Bogotá.</li>
              <li>Los productos están sujetos a disponibilidad de inventario.</li>
            </ul>
          </div>
          
          <!-- Pie de página -->
          <div style="text-align: center; color: #666; font-size: 10px; border-top: 1px solid #ddd; padding-top: 15px;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} AgroSoft SAS - Todos los derechos reservados</p>
            <p style="margin: 5px 0;">www.agrosoft.com • info@agrosoft.com • +57 1 234 5678</p>
            <p style="margin: 5px 0; font-style: italic;">"Cultivando el futuro de la agricultura colombiana"</p>
          </div>
        </div>
      `;

      document.body.appendChild(pdfElement);


      setTimeout(() => {
        html2canvas(pdfElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }


          pdf.save(`cotizacion-agrosoft-${new Date().toISOString().split('T')[0]}.pdf`);


          document.body.removeChild(pdfElement);
          setProcessingAction(false);
          addNotification('Reporte PDF generado exitosamente', 'success');
        }).catch(error => {
          console.error('Error generando PDF:', error);
          document.body.removeChild(pdfElement);
          setProcessingAction(false);
          addNotification('Error al generar el PDF', 'error');
        });
      }, 500);

    } catch (error) {
      console.error('Error en generación de PDF:', error);
      setProcessingAction(false);
      addNotification('Error al generar el reporte PDF', 'error');
    }
  };


  const generarReporteSimplePDF = () => {
    if (!carritoData?.items) return;

    const { subtotal, totalItems } = calcularTotales();

    const pdf = new jsPDF();


    pdf.setFont('helvetica');
    pdf.setFontSize(20);
    pdf.setTextColor(45, 80, 22);
    pdf.text('AGROSOFT SAS', 105, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Sistema Integral de Gestión Agrícola', 105, 28, { align: 'center' });


    pdf.setDrawColor(234, 128, 6);
    pdf.setLineWidth(0.5);
    pdf.line(20, 35, 190, 35);


    pdf.setFontSize(16);
    pdf.setTextColor(45, 80, 22);
    pdf.text('REPORTE DE COTIZACIÓN', 105, 45, { align: 'center' });


    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    let yPosition = 55;

    pdf.text(`Cliente: ${usuario.nombre_usuario}`, 20, yPosition);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 20, yPosition + 5);
    pdf.text(`No. Reporte: AG-${Date.now().toString().slice(-6)}`, 20, yPosition + 10);

    yPosition += 20;


    pdf.setFillColor(45, 80, 22);
    pdf.setTextColor(255, 255, 255);
    pdf.rect(20, yPosition, 170, 8, 'F');
    pdf.text('Producto', 25, yPosition + 6);
    pdf.text('Cant', 130, yPosition + 6);
    pdf.text('Precio', 150, yPosition + 6);
    pdf.text('Subtotal', 170, yPosition + 6);

    yPosition += 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);

    carritoData.items.forEach((item, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      let precio = item.precio_unitario_al_momento || 0;
      let subtotalItem = item.subtotal || 0;

      if (precio < 100) precio = precio * 1000;
      if (subtotalItem < 100) subtotalItem = subtotalItem * 1000;


      const productName = item.nombre_producto.length > 40 ?
        item.nombre_producto.substring(0, 40) + '...' : item.nombre_producto;

      pdf.text(productName, 25, yPosition);
      pdf.text(item.cantidad.toString(), 130, yPosition);
      pdf.text(formatPrice(precio), 150, yPosition);
      pdf.text(formatPrice(subtotalItem), 170, yPosition);

      yPosition += 8;


      if (item.descripcion_producto && yPosition < 250) {
        const desc = item.descripcion_producto.length > 60 ?
          item.descripcion_producto.substring(0, 60) + '...' : item.descripcion_producto;
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(desc, 25, yPosition);
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        yPosition += 5;
      }

      yPosition += 5;
    });

    yPosition += 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(120, yPosition, 190, yPosition);
    yPosition += 8;

    pdf.text('Subtotal:', 130, yPosition);
    pdf.text(formatPrice(subtotal), 170, yPosition);
    yPosition += 6;

    pdf.text('Envío:', 130, yPosition);
    pdf.setTextColor(40, 167, 69);
    pdf.text('GRATIS', 170, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setDrawColor(234, 128, 6);
    pdf.line(120, yPosition, 190, yPosition);
    yPosition += 10;

    pdf.text('TOTAL:', 130, yPosition);
    pdf.setTextColor(40, 167, 69);
    pdf.text(formatPrice(subtotal), 170, yPosition);

    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('© ' + new Date().getFullYear() + ' AgroSoft SAS - www.agrosoft.com', 105, 280, { align: 'center' });


    pdf.save(`cotizacion-agrosoft-${new Date().toISOString().split('T')[0]}.pdf`);
    addNotification('Reporte PDF generado exitosamente', 'success');
  };

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      setError(null);
      await actualizarCarrito();
    } catch (err) {
      console.error(" Error cargando carrito:", err);
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (idItem, nuevaCantidad, stockDisponible) => {
    if (nuevaCantidad < 1) {
      eliminarItem(idItem);
      return;
    }

    if (nuevaCantidad > stockDisponible) {
      addNotification(`Solo hay ${stockDisponible} unidades disponibles`, 'warning');
      return;
    }

    setProcessingAction(true);
    try {
      const response = await axios.put(`${API_URL}/carrito/actualizar-item/${idItem}`, {
        cantidad: nuevaCantidad
      });

      if (response.data.success) {
        await actualizarCarrito();
        addNotification('Cantidad actualizada correctamente', 'success');
      }
    } catch (err) {
      console.error("Error actualizando cantidad:", err);
      addNotification('Error al actualizar la cantidad', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const eliminarItem = async (idItem, productName = "producto") => {
    if (!window.confirm(`¿Estás seguro de eliminar "${productName}" del carrito?`)) return;

    setProcessingAction(true);
    try {
      const response = await axios.delete(`${API_URL}/carrito/eliminar-item/${idItem}`);

      if (response.data.success) {
        await actualizarCarrito();
        addNotification(`"${productName}" eliminado del carrito`, 'info');
      }
    } catch (err) {
      console.error("Error eliminando item:", err);
      addNotification('Error al eliminar el producto', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const calcularTotales = () => {
    if (!carritoData || !carritoData.items) return { subtotal: 0, totalItems: 0 };

    const subtotal = carritoData.items.reduce((sum, item) => {
      let precio = item.precio_unitario_al_momento || item.precio || 0;

      if (precio < 100) {
        precio = precio * 1000;
      }

      const cantidad = item.cantidad || 0;
      return sum + (precio * cantidad);
    }, 0);

    const totalItems = carritoData.items.reduce((sum, item) => sum + (item.cantidad || 0), 0);

    return { subtotal, totalItems };
  };

  const { subtotal, totalItems } = calcularTotales();


  const generarReporteCompra = () => {
    generarReportePDF();

  };

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setShowShippingForm(false);
    setShowPaymentModal(true);
  };

  const crearPedido = async () => {
    if (!selectedPaymentMethod) {
      addNotification('Por favor selecciona un método de pago', 'warning');
      return;
    }

    setProcessingPayment(true);
    try {
      const pedidoData = {
        id_usuario: usuario.id_usuario,
        id_metodo_pago: getPaymentMethodId(selectedPaymentMethod),
        direccion_envio: shippingData.direccion,
        ciudad_envio: shippingData.ciudad,
        codigo_postal_envio: shippingData.codigoPostal,
        notas_pedido: shippingData.notas || '',
        total_pedido: subtotal
      };

      console.log("Creando pedido con datos:", pedidoData);

      const response = await axios.post(`${API_URL}/pedidos/crear`, pedidoData, {
        timeout: 10000
      });

      if (response.data.success) {
        addNotification('¡Compra realizada exitosamente!', 'success');

        setShowPaymentModal(false);
        setShippingData(null);
        setSelectedPaymentMethod("");

        await cargarCarrito();
        setTimeout(() => {
          navigate('/mis-pedidos');
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error(' ERROR DETALLADO:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });

      const serverError = error.response?.data?.error || error.response?.data?.message || error.message;
      addNotification(` Error: ${serverError}`, 'error');

    } finally {
      setProcessingPayment(false);
    }
  };

  const getPaymentMethodId = (method) => {
    const methods = {
      'tarjeta': 1,
      'transferencia': 4,
      'efectivo': 5
    };
    return methods[method] || 1;
  };

  const procederAlPago = () => {
    setShowShippingForm(true);
  };

  if (loading || contextLoading) {
    return (
      <div className="carrito-container">
        <div className="carrito-loading">
          <FaShoppingCart className="loading-icon" />
          <p>Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carrito-container">
        <div className="carrito-error">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error al cargar el carrito</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button className="carrito-btn-primary" onClick={cargarCarrito}>
              Reintentar
            </button>
            <button className="carrito-btn-secondary" onClick={() => navigate('/catalogo')}>
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <div className="carrito-header-top">
          <button className="carrito-volver-btn" onClick={() => navigate(-1)} type="button">
            <FaArrowLeft />
            Volver
          </button>
        </div>
        <h1 className="carrito-title">Mi Carrito</h1>
      </div>

      {!usuario ? (
        <div className="carrito-mensaje">
          <FaShoppingCart className="mensaje-icon" />
          <h3>Inicia sesión para ver tu carrito</h3>
          <p>Necesitas tener una cuenta para gestionar tu carrito de compras</p>
          <button className="carrito-btn-primary" onClick={() => navigate("/login")} type="button">
            Iniciar Sesión
          </button>
        </div>
      ) : !carritoData?.items || carritoData.items.length === 0 ? (
        <div className="carrito-mensaje">
          <FaShoppingCart className="mensaje-icon" />
          <h3>Tu carrito está vacío</h3>
          <p>Descubre nuestros productos frescos y de calidad</p>
          <button className="carrito-btn-primary" onClick={() => navigate("/catalogo")} type="button">
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="carrito-content">
          <div className="carrito-items-section">
            <div className="carrito-items-header">
              <h2>Productos en el carrito ({totalItems})</h2>
            </div>

            <div className="carrito-items-grid">
              {carritoData.items.map(item => {
                let precioMostrar = item.precio_unitario_al_momento || 0;
                if (precioMostrar < 100) {
                  precioMostrar = precioMostrar * 1000;
                }

                let subtotalMostrar = item.subtotal || 0;
                if (subtotalMostrar < 100) {
                  subtotalMostrar = subtotalMostrar * 1000;
                }

                return (
                  <div key={item.id_detalle_carrito} className="carrito-item-card">
                    <div className="carrito-item-imagen-container">
                      <img
                        src={item.url_imagen}
                        alt={item.nombre_producto}
                        className="carrito-item-imagen"
                      />
                    </div>

                    <div className="carrito-item-detalles">
                      <h3 className="carrito-item-nombre">{item.nombre_producto}</h3>
                      <p className="carrito-item-descripcion">{item.descripcion_producto}</p>

                      <div className="carrito-item-precios">
                        <span className="carrito-item-precio-unitario">
                          {formatPrice(precioMostrar)} / {item.unidad_medida}
                        </span>
                        <span className="carrito-item-subtotal">
                          Subtotal: {formatPrice(subtotalMostrar)}
                        </span>
                      </div>
                    </div>

                    <div className="carrito-item-controles">
                      <div className="cantidad-controls">
                        <button
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(item.id_detalle_carrito, item.cantidad - 1, 100)}
                          disabled={processingAction || item.cantidad <= 1}
                          type="button"
                        >
                          <FaMinus />
                        </button>

                        <span className="cantidad-display">{item.cantidad}</span>

                        <button
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(item.id_detalle_carrito, item.cantidad + 1, 100)}
                          disabled={processingAction}
                          type="button"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="carrito-btn-eliminar"
                        onClick={() => eliminarItem(item.id_detalle_carrito, item.nombre_producto)}
                        disabled={processingAction}
                        type="button"
                      >
                        <FaTrash />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="carrito-resumen-section">
            <div className="carrito-resumen-card">
              <h3>Resumen de compra</h3>

              <div className="resumen-detalles">
                <div className="resumen-fila">
                  <span>Productos ({totalItems})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="resumen-fila">
                  <span>Envío</span>
                  <span className="envio-gratis">¡Gratis!</span>
                </div>

                <div className="resumen-separador"></div>

                <div className="resumen-total">
                  <span>Total</span>
                  <span className="total-precio">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                className="carrito-btn-comprar"
                onClick={procederAlPago}
                disabled={processingAction}
                type="button"
              >
                <FaCreditCard />
                {processingAction ? "Procesando..." : " Finalizar Compra"}
              </button>

              <button
                className="carrito-btn-reporte"
                onClick={generarReporteCompra}
                disabled={processingAction}
                type="button"
              >
                <FaFileAlt />
                {processingAction ? "Generando PDF..." : "Generar Reporte PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ShippingFormModal
        isOpen={showShippingForm}
        onClose={() => setShowShippingForm(false)}
        onContinue={handleShippingSubmit}
        usuario={usuario}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        shippingData={shippingData}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        onConfirm={crearPedido}
        processingPayment={processingPayment}
        total={subtotal}
        formatPrice={formatPrice}
        carritoData={carritoData}
      />
    </div>
  );
};

export default Carrito;