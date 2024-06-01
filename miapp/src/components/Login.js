import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Importar el hook de contexto
import './style.css'; // Importa los estilos CSS para el componente
import Modal from './Modal'; // Importar el componente de ventana modal

function Login() {
  const [msgError, setMsgError] = useState('');
  const { setNoControl } = useAuth(); // Obtener la función para establecer noControl del contexto
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la ventana modal

  useEffect(() => {
    const loginForm = document.querySelector(".my-form");

    const handleSubmit = async (e) => {
      e.preventDefault();

      const nocontrol = document.getElementById("NumControl").value;
      const password = document.getElementById("password").value;

      if (nocontrol === '' || password === '') {
        setMsgError('Por favor, complete todos los campos.');
        return;
      }

      setMsgError('');

      try {
        const response = await axios.post(
          'http://localhost:3001/login',
          { noControl: nocontrol, password },
          { withCredentials: true }
        );

        const result = response.data;

        if (result.message === "Sesión iniciada exitosamente") {
          console.log("Iniciando sesión");

          // Limpiar cualquier noControl previo
          localStorage.removeItem('noControl');
          setNoControl(null);

          // Guardar el nuevo noControl
          localStorage.setItem('noControl', nocontrol);
          setNoControl(nocontrol); // Guardar noControl en el contexto

          window.location.href = '/tabla';
        } else {
          setMsgError("Usuario o contraseña incorrectos");
        }
      } catch (error) {
        console.error('Error:', error);
        setMsgError('Hubo un problema con la autenticación. Inténtelo de nuevo más tarde.');
      }
    };

    loginForm.addEventListener("submit", handleSubmit);

    return () => {
      loginForm.removeEventListener("submit", handleSubmit);
    };
  }, [setNoControl]);

  return (
    <div>
      <form className="my-form">
        <div className="login-welcome-row">
          <h1>Bienvenido &#x1F44F;</h1>
          <p>Modulo Alumno</p>
        </div>
        {msgError && <div className="error">{msgError}</div>}
        <div className="input__wrapper">
          <input
            type="text"
            id="NumControl"
            name="NumControl"
            className="input__field"
            placeholder="Your NumControl"
            required
          />
          <label htmlFor="NumControl" className="input__label">Número de control</label>
        </div>
        <div className="input__wrapper">
          <input
            id="password"
            type="password"
            className="input__field"
            placeholder="Your Password"
            required
          />
          <label htmlFor="password" className="input__label">Contraseña:</label>
        </div>
        <button type="submit" className="my-form__button">Iniciar sesión</button>
        <div className="my-form__actions">
          <div className="my-form__row">
            <span>¿No tienes cuenta?</span>
            <Link to="/Registro" title="Create Account">Regístrate</Link>
          </div>
          <button type="button" className="my-form__button" onClick={() => setIsModalOpen(true)}>
            Acerca de
          </button>
        </div>
      </form>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Login;

