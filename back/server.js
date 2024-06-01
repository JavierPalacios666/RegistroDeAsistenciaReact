const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const session = require("express-session");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Accept",
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 980000 },
  })
);

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "javier",
  password: "123",
  database: "proyecto2024",
  connectionLimit: 5,
});

app.post("/login", async (req, res) => {
  const { noControl, password } = req.body;
  console.log("Credenciales recibidas:", noControl, password); // Agrega esto para depuración

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      "SELECT * FROM alumnos WHERE noControl = ? AND password = ?",
      [noControl, password]
    );
    conn.release();

    if (rows.length > 0) {
      // Limpiar cualquier dato de sesión previo y luego establecer la nueva sesión
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error al regenerar la sesión:", err);
          return res.status(500).json({ error: "Error al regenerar la sesión" });
        }

        req.session.noControl = noControl;
        res.status(200).json({ message: "Sesión iniciada exitosamente", noControl });
      });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  });
});

app.get("/Misgrupos", async (req, res) => {
  if (!req.session.noControl) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const noControl = req.session.noControl;
  console.log(noControl);
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      "SELECT * FROM vtaalumnogrupos WHERE noControl = ?",
      [noControl]
    );
    conn.release();
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "No tienes grupos" });
    }
  } catch (error) {
    console.error("Error al obtener asistencias: ", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

// guarda tu pase de lista
app.post("/pasarLista", async (req, res) => {
  const { noControl, idmateria, idgrupo, idprofesor, fecha, hora, reg_fecha, status } = req.body;
  try {
    const horaSinSegundos = hora.slice(0, 5); // Remover los segundos de la hora
    const regFechaCompleta = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato completo de fecha y hora
    const conn = await pool.getConnection();

    await conn.query(
      "INSERT INTO asistencia (noControl, idmateria, idgrupo, idprofesor, fecha, hora, reg_fecha, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [noControl, idmateria, idgrupo, idprofesor, fecha, horaSinSegundos, regFechaCompleta, "1"]
    );
    conn.release();
    res.status(201).json({ message: "Asistencia registrada exitosamente" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: "Ya has registrado asistencia para esta clase en esta fecha." });
    } else {
      console.error("Error al registrar asistencia: ", error);
      res.status(500).json({ error: "Error al registrar asistencia" });
    }
  }
});
//registra un nuevo alumno
app.post("/register", async (req, res) => {
  const { noControl, nombre, apellidos, telefono, email, password, status } = req.body;
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM alumnos WHERE noControl = ?", [noControl]);
    if (rows.length > 0) {
      conn.release();
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    await conn.query(
      "INSERT INTO alumnos (noControl, nombre, apellidos, telefono, email, password, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [noControl, nombre, apellidos, telefono, email, password, status]
    );
    conn.release();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario: ", error);
    res.status(500).json({ error: "Error al registrar usuario", details: error.message });
  }
});

// Endpoint para obtener los grupos disponibles
app.get('/gruposDisponibles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proyecto2024.vtaprofesorgrupos');
    res.json(rows);
  } catch (error) { 
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Endpoint para registrar un grupo
app.post('/registrarGrupo', async (req, res) => {
  const { noControl, idmateria, idgrupo, idprofesor } = req.body;

  try {
    const [existingRows] = await pool.query(
      "SELECT * FROM alumnogrupos WHERE noControl = ? AND idmateria = ? AND idgrupo = ? AND idprofesor = ?",
      [noControl, idmateria, idgrupo, idprofesor]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ error: "Ya estás registrado en este grupo" });
    }

    await pool.query(
      "INSERT INTO alumnogrupos (noControl, idprofesor, idmateria, idgrupo, status) VALUES (?, ?, ?, ?, '1')",
      [noControl, idprofesor, idmateria, idgrupo]
    );

    res.status(201).json({ message: "Registrado en el grupo exitosamente" });
  } catch (error) {
    console.error("Error al registrar grupo: ", error);
    res.status(500).json({ error: "Error al registrar grupo" });
  }
});

//Elimina el grupo
app.delete('/eliminarGrupo', async (req, res) => {
  const { noControl, idprofesor, idmateria, idgrupo } = req.body;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      'DELETE FROM alumnogrupos WHERE noControl = ? AND idprofesor = ? AND idmateria = ? AND idgrupo = ?',
      [noControl, idprofesor, idmateria, idgrupo]
    );
    conn.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Grupo eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Grupo no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar grupo: ', error);
    res.status(500).json({ error: 'Error al eliminar grupo' });
  }
});

// Endpoint para obtener asistencias de un alumno en un grupo específico
app.get('/asistencias/:noControl/:idprofesor/:idmateria/:idgrupo', async (req, res) => {
  const { noControl, idprofesor, idmateria, idgrupo } = req.params;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT noControl, idprofesor, idmateria, idgrupo, 
              CONCAT(fecha, ' ', hora) AS fecha  -- Combinamos fecha y hora
       FROM asistencia 
       WHERE noControl = ? 
         AND idprofesor = ?
         AND idmateria = ?
         AND idgrupo = ?`,
      [noControl, idprofesor, idmateria, idgrupo] 
    );
    conn.release();

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "No se encontraron asistencias" });
    }
  } catch (error) {
    console.error("Error al obtener asistencias: ", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
