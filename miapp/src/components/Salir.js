import React from 'react';

function Salir() {
  const cerrarSesion = async () => {
    try {
      await fetch('http://localhost/phpAPI/CerrarSesiones.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      sessionStorage.clear(); // Limpiar la sesión
      window.location.href = '/Login'; // Redirigir a la página de inicio de sesión
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      cerrarSesion(); // Cerrar sesión al presionar el botón de retroceso
    };

    window.history.pushState(null, '', window.location.pathname); // Reemplazar la entrada en el historial sin agregar una nueva
    window.addEventListener('popstate', handleBackButton); // Agregar un evento al botón de retroceso

    return () => {
      window.removeEventListener('popstate', handleBackButton); // Eliminar el evento al desmontar el componente
    };
  }, []); // Ejecutar solo una vez al montar el componente
  window.location.href = '/Login';
  return null; // Este componente no renderiza nada visible en la pantalla
}

export default Salir;
