// src/App.js
import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Register from './components/Registro';
import Login from './components/Login';
import Table from './components/Tabla';
import AltaGrupo from './components/AltaGrupo'
import Salir from './components/Salir';
import Asistencias from './components/Asistencias.js';
import AdministrarGrupo from './components/AdministrarGrupo';
import PaseDeLista from './components/PaseDeLista';

// Importar el proveedor de contexto AuthProvider
import { AuthProvider } from './components/AuthContext'; 

function App() {
    return (
        <div className="App">
            <AuthProvider> {/* Envolver las rutas con el proveedor de contexto */}
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/AdministrarGrupo" element={<AdministrarGrupo />} />
                        <Route path="/registro" element={<Register />} />
                        <Route path="/tabla" element={<Table />} />
                        <Route path="/asistencias" element={<Asistencias />} />
                        <Route path="/PaseDeLista" element={<PaseDeLista />} />
                        <Route path="/altagrupo" element={<AltaGrupo />} />
                        <Route path="/salir" element={<Salir />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider> 
        </div>
    );
}

export default App;
