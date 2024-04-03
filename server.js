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

// Definir ruta para obtener restaurantes cercanos
app.get('/restaurantes-cercanos', async (req, res) => {
    try {
        // Obtener parámetros de latitud y longitud desde la solicitud
        const { latitud, longitud } = req.query;

        // Verificar que se proporcionaron los parámetros requeridos
        if (!latitud || !longitud) {
            return res.status(400).json({ error: 'Los parámetros de latitud y longitud son requeridos' });
        }

        // Consulta SQL para obtener restaurantes cercanos utilizando la función definida en la base de datos
        const consulta = "SELECT * FROM restaurante WHERE ABS(ABS(restaurante.coordenada_latitud) - ABS("+longitud+"))  <= 0.005 AND ABS(ABS(restaurante.coordenada_longitud) - ABS("+latitud+")) <= 0.005;";

        // Ejecutar consulta en la base de datos
        const resultado = await client.query(consulta);

        // Devolver los restaurantes cercanos encontrados
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes cercanos:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes cercanos' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
  });
