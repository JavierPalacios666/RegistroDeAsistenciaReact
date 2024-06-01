import React, { useState, useEffect } from 'react';
import './estiloTabla.css'; // Asegúrate de incluir tus estilos CSS
import { Link, useNavigate } from 'react-router-dom';

function Tabla() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/Misgrupos', {
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
          window.location.href = '/AltaGrupo';
        } else {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handlePasarLista = (index) => {
    const selectedGroup = data[index];
    navigate('/PaseDeLista', { state: { group: selectedGroup } });
  };

  const handleVerAsistencias = (index) => {
    const selectedGroup = data[index];
    navigate('/asistencias', { state: { group: selectedGroup } });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-container">
      <div className="header-buttons">
        <Link to="/AdministrarGrupo" className="header-btn">Administrar mis grupos</Link>
        <Link to="/AltaGrupo" className="header-btn">Alta a un grupo</Link>
        <Link to="/Salir" className="header-btn">Cerrar sesión</Link>
      </div>
      <h1>Mis grupos</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID Materia</th>
            <th>ID Grupo</th>
            <th>Nombre Materia</th>
            <th>ID Profesor</th>
            <th>Nombre Profesor</th>
            <th>No. de control</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.idmateria}</td>
              <td>{item.idgrupo}</td>
              <td>{item.nombremateria}</td>
              <td>{item.idprofesor}</td>
              <td>{item.nombreprofesor}</td>
              <td>{item.noControl}</td>
              <td>
                <button className="btn-pasar-lista" onClick={() => handlePasarLista(index)}>Pasar Lista</button>
                <button className="btn-ver-asistencias" onClick={() => handleVerAsistencias(index)}>Ver Asistencias</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabla;
