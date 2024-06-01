import React, { useState, useEffect } from 'react';
import './estiloTabla.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AltaGrupo() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msgError, setMsgError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/gruposDisponibles', {
          withCredentials: true
        });
        const result = response.data;
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const darAlta = async (index) => {
    const selectedData = data[index];
    const { idmateria, idgrupo, idprofesor, nombreprofesor, nombremateria } = selectedData;
    const noControl = localStorage.getItem('noControl'); // Obtener noControl del localStorage

    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:3001/registrarGrupo',
        { noControl, idmateria, idgrupo, idprofesor },
        { withCredentials: true }
      );

      const result = response.data;
      if (result.error) {
        setMsgError('Ya estas registrado');
      } else {
        window.location.href = '/Tabla';
      }
    } catch (error) {
      console.error('Error al enviar solicitud POST:', error);
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <div className="header-buttons">
        <Link to="/Tabla" title="Tabla" className="header-btn">Regresar a mis materias</Link>
        <Link to="/Salir" title="Cerrar sesión" className="header-btn">Cerrar sesión</Link>
      </div>
      <h1>Altas de grupos</h1>
      {msgError && <div className="error">{msgError}</div>}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Id Materia</th>
            <th>Id Grupo</th>
            <th>Id Profesor</th>
            <th>Nombre Profesor</th>
            <th>Nombre materia</th>
            
            <th>Proceso</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.idmateria}</td>
              <td>{item.idgrupo}</td>
              <td>{item.idprofesor}</td>
              <td>{item.nombreprofesor}</td>
              <td>{item.nombremateria}</td>

              <td>
                <button
                  className="Registrarme"
                  onClick={() => darAlta(index)}
                  disabled={isLoading}
                >
                  Registrarme en el grupo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AltaGrupo;
