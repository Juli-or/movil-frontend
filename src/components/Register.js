import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom'; 
import { DropdownButton, Dropdown, ButtonGroup, Container, Carousel } from "react-bootstrap";

function Register({ onLogin }) { 
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    password: "",
    documento_identidad: "",
    id_rol: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.nombre_usuario) newErrors.nombre_usuario = "Nombre obligatorio";
    if (!formData.correo_electronico) newErrors.correo_electronico = "Correo obligatorio";
    if (!formData.password) newErrors.password = "Contraseña obligatoria";
    if (!formData.documento_identidad) newErrors.documento_identidad = "Documento obligatorio";
    if (!formData.id_rol) newErrors.id_rol = "Debes elegir un rol";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      let response;
      const MAX_RETRIES = 3;
      const BASE_DELAY = 1000;

      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          response = await fetch(
            "http://localhost:4000/api/users/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
            }
          );
          if (response.ok || response.status === 400) {
             break; 
          }
        } catch (fetchError) {
          if (i === MAX_RETRIES - 1) throw fetchError; 
          await new Promise(resolve => setTimeout(resolve, BASE_DELAY * Math.pow(2, i)));
        }
      }

      if (!response) {
         throw new Error("No se pudo conectar con el servidor.");
      }

      const data = await response.json();
      console.log("Registro:", data);

      setMessage(data.message);
      setStatus(data.status);

      if (data.status === "success") {
        const id_rol_num = Number(formData.id_rol);
        const userData = {
          id_usuario: data?.user?.id_usuario, 
          id_rol: id_rol_num,
          nombre: formData.nombre_usuario,
          email: formData.correo_electronico,
        };

        if (typeof onLogin === 'function') {
          onLogin(userData);
        } else {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        if (id_rol_num === 3) {
          navigate('/productor', { replace: true });
        } else {
          navigate('/catalogo', { replace: true });
        }
      }

    } catch (error) {
      console.error("Error al registrar:", error);
      setMessage("Error de conexión al servidor.");
      setStatus("error");
    }
  };

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const styles = {
    btnNaranja: {
        backgroundColor: '#FFA500', 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        border: 'none', 
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    },
    dropdownNaranja: {
        width: '100%',
        marginTop: '5px',
    },
    toastSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '15px',
        textAlign: 'center',
        opacity: 1,
        transition: 'opacity 0.5s'
    },
    toastError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '15px',
        textAlign: 'center',
        opacity: 1,
        transition: 'opacity 0.5s'
    },
    inputError: {
      borderColor: 'red',
      backgroundColor: '#ffe0e0'
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center" style={{ position: 'relative' }}>
      <img
        src="/img/1.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          width: "70px",
          height: "auto",
          zIndex: 2,
          filter: "brightness(0) invert(0)"
        }}
        onError={(e) => e.target.src = "https://placehold.co/70x70/006400/FFFFFF?text=Logo"}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="d-flex shadow-lg rounded-4 overflow-hidden"
        style={{ width: "800px", maxHeight: "90vh", minHeight: "500px" }}
      >
        <div className="d-none d-md-block" style={{ width: "50%", minHeight: "100%", maxHeight: "90vh" }}>
          <Carousel fade className="h-100">
            <Carousel.Item className="h-100">
              <img src="/img/food-3250439.jpg" alt="visual1" className="d-block w-100 h-100" style={{objectFit: "cover"}} onError={(e) => e.target.src = "https://placehold.co/400x500/A0E8AF/006400?text=Comida"} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/grapevine-7368800.jpg" alt="visual2" className="d-block w-100 h-100" style={{objectFit: "cover"}} onError={(e) => e.target.src = "https://placehold.co/400x500/A0E8AF/006400?text=Viñedo"} />
            </Carousel.Item>
            <Carousel.Item className="h-100">
              <img src="/img/corn-5151505.jpg" alt="visual3" className="d-block w-100 h-100" style={{objectFit: "cover"}} onError={(e) => e.target.src = "https://placehold.co/400x500/A0E8AF/006400?text=Maíz"} />
            </Carousel.Item>
          </Carousel>
        </div>

        <motion.div
          className="bg-light p-5"
          style={{ width: "50%", overflowY: "auto" }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <motion.h3 className="mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            Registro de usuario 
          </motion.h3>

          <form onSubmit={handleSubmit}>
            {["nombre_usuario", "correo_electronico", "password", "documento_identidad"].map((field, index) => (
              <motion.div key={field} className="mb-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 * index }}>
                <label className="form-label">
                  {field === "nombre_usuario" ? "Nombre de usuario"
                    : field === "correo_electronico" ? "Correo electrónico"
                    : field === "password" ? "Contraseña"
                    : "Documento de identidad"}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={errors[field] ? styles.inputError : {}}
                  placeholder={errors[field] ? errors[field] :
                    field === "nombre_usuario" ? "Escribe tu nombre" :
                    field === "correo_electronico" ? "ejemplo@correo.com" :
                    field === "password" ? "********" :
                    "123456789"
                  }
                />
              </motion.div>
            ))}

            <motion.div className="mb-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <label className="form-label px-3">Elige tu rol</label>
              <DropdownButton
                as={ButtonGroup}
                style={styles.dropdownNaranja}
                variant="warning" 
                title={
                  formData.id_rol
                    ? formData.id_rol === "1" ? "Cliente"
                    : formData.id_rol === "2" ? "Administrador"
                    : "Agricultor"
                    : errors.id_rol ? errors.id_rol : "Selecciona un rol"
                }
                onSelect={(eventKey) => setFormData({ ...formData, id_rol: eventKey })}
              >
                <Dropdown.Item eventKey="1">Cliente</Dropdown.Item>
                <Dropdown.Item eventKey="2">Administrador</Dropdown.Item>
                <Dropdown.Item eventKey="3">Agricultor</Dropdown.Item>
              </DropdownButton>
              {errors.id_rol && <div className="text-danger mt-1">{errors.id_rol}</div>}
            </motion.div>

            <motion.button type="submit" className="btn mt-3" style={styles.btnNaranja} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Unirse a la familia
            </motion.button>
          </form>

          {message && (
            <div style={status === "success" ? styles.toastSuccess : styles.toastError}>
              {message}
            </div>
          )}

          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-link mt-3" style={{ color: '#006400' }}>
              ¿Tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}

export default Register;