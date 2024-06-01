// Modal.js
import React from 'react';
import './modal.css'; // Importa los estilos CSS para la ventana modal

function Modal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Integrantes del Equipo</h2>
        <ul>
          <p><span className="name">Mariana del Rocio Copca Rojas</span> No. de control: L20350260</p>
          <p><span className="name">Brayan Crisantos Villa</span> No. de control: L19021058</p>
          <p><span className="name">Luis Gabriel Paez Carrillo</span> No. de control: L20021267</p>
          <p><span className="name">Javier Alberto Palacios López</span> No. de control: L20021268</p>
          <p><span className="name">José Joel Sánchez Velázquez</span> No. de control: L20021285</p>
        </ul>
        <button onClick={onClose} className="modal__button">Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;

