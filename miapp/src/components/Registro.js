import React, { useEffect } from 'react';
import './style.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

function Registro() {
  useEffect(() => {
    const registerForm = document.querySelector(".my-form");

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const noControl = document.getElementById("NumControl").value;
        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        const response = await axios.post(
          'http://localhost:3001/register',
          {
            noControl,
            nombre,
            apellidos,
            telefono,
            email,
            password,
            status: 1
          },
          { withCredentials: true }
        );

        const result = response.data;
        console.log('Response:', result);

        if (result.message === "Usuario registrado exitosamente") {
          window.location.href = '/Login';
        } else {
          console.log(result.message);
        }

      } catch (error) {
        console.error('Error:', error);
      }
    };

    registerForm.addEventListener("submit", handleSubmit);

    return () => {
      registerForm.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return (
    <form className="my-form">
      <div className="register-welcome-row">
        <h1>Registro Alumnos &#x1F44F;</h1>
      </div>
      <div className="input__wrapper">
        <input type="text" id="NumControl" name="NumControl" className="input__field" placeholder="Número de control" required />
        <label htmlFor="NumControl" className="input__label">Número de control</label>
      </div>
      <div className="input__wrapper">
        <input type="text" id="nombre" name="nombre" className="input__field" placeholder="Nombre(s)" title="Solo se pueden letras" required pattern="[A-Za-z\s]+" />
        <label htmlFor="nombre" className="input__label">Nombre(s)</label>
      </div>
      <div className="input__wrapper">
        <input type="text" id="apellidos" name="apellidos" className="input__field" placeholder="Apellido(s)" title="Solo se pueden letras" required pattern="[A-Za-z\s]+" />
        <label htmlFor="apellidos" className="input__label">Apellido(s)</label>
      </div>
      <div className="input__wrapper">
        <input type="tel" id="telefono" name="telefono" className="input__field" placeholder="Teléfono" required pattern="[0-9]{10}" title="Debe ser un número de 10 dígitos" />
        <label htmlFor="telefono" className="input__label">Teléfono (10 dígitos)</label>
      </div>
      <div className="input__wrapper">
        <input type="email" id="correo" name="correo" className="input__field" placeholder="Correo electrónico" required />
        <label htmlFor="correo" className="input__label">Correo electrónico</label>
      </div>
      <div className="input__wrapper">
        <input id="password" type="password" className="input__field" placeholder="Contraseña" title="Mínimo 6 caracteres incluyendo una letra y un número" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$" required />
        <label htmlFor="password" className="input__label">Contraseña:</label>
      </div>
      <button type="submit" className="my-form__button">Registrarse</button>
      <div className="my-form__actions">
        <div className="my-form__row">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/Login" title="Iniciar">Iniciar</Link>
        </div>
      </div>
    </form>
  );
}

export default Registro;
