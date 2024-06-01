// Modal.js
import React from 'react';
import './modal.css'; // Importa los estilos CSS para la ventana modal

function Modal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Integrantes del Equipo</h2>
        <ul>
          <li>Integrante 1</li>
          <li>Integrante 2</li>
          <li>Integrante 3</li>
          <li>Integrante 4</li>
        </ul>
        <button onClick={onClose} className="modal__button">Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;

