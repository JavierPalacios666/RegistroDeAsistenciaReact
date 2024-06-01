import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './estiloTabla.css';
import axios from 'axios';

function PaseDeLista() {
  const location = useLocation();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const storedNoControl = localStorage.getItem('noControl');

    if (!storedNoControl) {
      navigate('/Login');
      return;
    }

    if (location.state && location.state.group) {
      setGroup({
        ...location.state.group,
        noControl: storedNoControl
      });
    }
  }, [location.state, navigate]);

  const handleConfirmarPaseDeLista = async () => {
    try {
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toLocaleTimeString();

      const datosAsistencia = {
        noControl: group.noControl,
        idmateria: group.idmateria,
        idgrupo: group.idgrupo,
        idprofesor: group.idprofesor,
        fecha,
        hora
      };

      console.log('Datos a enviar:', datosAsistencia);

      const response = await axios.post(
        'http://localhost:3001/pasarLista',
        datosAsistencia,
        { withCredentials: true }
      );

      const result = response.data;
      console.log('Respuesta del servidor:', result);

      if (result.error) {
        console.error('Error:', result.error);
      } else {
        alert('Pase de lista confirmado');
        navigate('/Tabla');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <h1>Pase de Lista</h1>
      <table className="styled-table">
        <tbody>
          <tr>
            <td>Fecha</td>
            <td>{new Date().toISOString().split('T')[0]}</td>
          </tr>
          <tr>
            <td>Hora</td>
            <td>{new Date().toLocaleTimeString()}</td>
          </tr>
          <tr>
            <td>Materia</td>
            <td>{group.nombremateria}</td>
          </tr>
          <tr>
            <td>Id Materia</td>
            <td>{group.idmateria}</td>
          </tr>
          <tr>
            <td>Gpo</td>
            <td>{group.idgrupo}</td>
          </tr>
          <tr>
            <td>Profesor</td>
            <td>{group.nombreprofesor}</td>
          </tr>
          <tr>
            <td>Id Profesor</td>
            <td>{group.idprofesor}</td>
          </tr>
        </tbody>
      </table>
      <div className="button-container">
        <Link to="/Tabla" className="btn volver">Volver</Link>
        <button className="btn confirmar" onClick={handleConfirmarPaseDeLista}>Confirmar Pase de Lista</button>
      </div>
    </div>
  );
}

export default PaseDeLista;
