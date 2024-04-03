const express = require('express');
const { Client } = require('pg');

const cors = require('cors');

const app = express();
const PORT = 5000;

// Habilitar CORS
app.use(cors());

// Configuración de la conexión a la base de datos
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "hans2003",
    database: "noraadb"
});
client.connect();

// Definir ruta para obtener restaurantes
app.get('/restaurantes', async (req, res) => {
    try {
        const consulta = 'SELECT * FROM "public"."restaurante"';
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
  });