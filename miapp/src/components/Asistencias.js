import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './estiloTabla.css';
import { useAuth } from './AuthContext'; // Importar el hook de contexto

function Asistencias() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { idmateria, idgrupo, idprofesor } = location.state.group;
  const { noControl } = useAuth(); // Obtener noControl del contexto

  useEffect(() => {
    if (!noControl) {
      setError('NoControl no disponible');
      navigate('/login'); // Redirige al login si noControl no está disponible
      return;
    }

    const fetchData = async () => {
      try {
        console.log(noControl);
        const response = await fetch(`http://localhost:3001/asistencias/${noControl}/${idprofesor}/${idmateria}/${idgrupo}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (result.error) {
          setError(result.error);
          alert('No tienes asistencias en este grupo');
          navigate('/tabla');
        } else {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [idmateria, idgrupo, idprofesor, noControl, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <div className="header-buttons">
        <button onClick={() => navigate('/tabla')} className="header-btn">Regresar</button>
        <Link to="/salir" className="header-btn">Cerrar sesión</Link>
      </div>
      <h1>Asistencias del Grupo</h1>
      {data.length === 0 ? (
        <div>No tienes asistencias en este grupo</div>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>No. de Control</th>
              <th>ID Profesor</th>
              <th>ID Materia</th>
              <th>ID Grupo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.noControl}</td>
                <td>{item.idprofesor}</td>
                <td>{item.idmateria}</td>
                <td>{item.idgrupo}</td>
                <td>{item.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Asistencias;
