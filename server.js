const express = require('express');
const { Client } = require('pg');

const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "hans2003",
    database: "noraadb"
});
client.connect();

app.get('/platillos-filtrar', async (req, res) => {
    try {
        const { filtro } = req.query;
        if (!filtro) {
            return res.status(400).json({ error: 'El filtro es requerido' });
        }
        const consulta = 'SELECT * FROM "public"."consumible" WHERE nombre_consumible LIKE %'+filtro+'%;';
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
});

app.get('/avistamientos', async (req, res) => {
    try {
        const consulta = 'SELECT * FROM "public"."registro_avistamiento"';
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
});

app.get('/etiquetas', async (req, res) => {
    try {
        const consulta = 'SELECT * FROM "public"."etiqueta"';
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener las etiquetas:', error);
        res.status(500).json({ error: 'Error al obtener etiquetas' });
    }
});

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

app.get('/restaurantes-filtrar', async (req, res) => {
    try {
        const { filtro } = req.query;
        if (!filtro) {
            return res.status(400).json({ error: 'Los parámetros de latitud y longitud son requeridos' });
        }
        const consulta = 'SELECT * FROM "public"."restaurante" WHERE '+filtro+';';
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
});

app.get('/restaurantes-por-etiqueta', async (req, res) => {
    try {
        const { etiqueta } = req.query;
        if (!etiqueta) {
            return res.status(400).json({ error: 'Los parámetros de latitud y longitud son requeridos' });
        }
        const consulta = `SELECT * FROM "public"."restaurante" res INNER JOIN "public"."etiqueta_restaurante" er ON res.id_restaurante = er.id_restaurante_etiquetado INNER JOIN "public"."etiqueta" et ON er.id_etiqueta_restaurante = et.id_etiqueta WHERE et.etiqueta_nombre = '`+etiqueta+`';`;
        const resultado = await client.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    }
});

app.get('/restaurantes-cercanos', async (req, res) => {
    try {
        const { latitud, longitud } = req.query;

        if (!latitud || !longitud) {
            return res.status(400).json({ error: 'Los parámetros de latitud y longitud son requeridos' });
        }

        const consulta = "SELECT * FROM restaurante WHERE ABS(ABS(restaurante.coordenada_latitud) - ABS("+longitud+"))  <= 0.008 AND ABS(ABS(restaurante.coordenada_longitud) - ABS("+latitud+")) <= 0.008;";

        const resultado = await client.query(consulta);

        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes cercanos:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes cercanos' });
    }
});

app.get('/restaurantes-cercanos-limitados', async (req, res) => {
    try {
        const { latitud, longitud, limite } = req.query;

        if (!latitud || !longitud || !limite)  {
            return res.status(400).json({ error: 'Los parámetros de limite, latitud y longitud son requeridos' });
        }

        const consulta = "SELECT * FROM restaurante WHERE ABS(ABS(restaurante.coordenada_latitud) - ABS("+longitud+"))  <= 0.008 AND ABS(ABS(restaurante.coordenada_longitud) - ABS("+latitud+")) <= 0.008 LIMIT "+limite+"; ";

        const resultado = await client.query(consulta);

        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener restaurantes cercanos:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes cercanos' });
    }
});

app.use(express.json({ limit: '10mb' }));
app.post('/restaurantes-registrar', async (req, res) => {
    try {
        const { nombre_restaurante, direccion, telefono, horario_atencion, coordenada_longitud, coordenada_latitud, valoracion, icono_base, imagen, etiquetas } = req.body;
        if (!nombre_restaurante || !direccion || !telefono || !horario_atencion || !coordenada_longitud || !coordenada_latitud || !icono_base || !imagen) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Convertir la imagen base64 a formato de bytes
        const byteArray = Buffer.from(imagen.split(',')[1], 'base64');
        console.log('IMAGEN CONVERTIDA');
        // Consulta para insertar el restaurante
        const consultaRestaurante = `INSERT INTO restaurante (nombre_restaurante, direccion, telefono, horario_atencion, coordenada_longitud, coordenada_latitud, valoracion, imagen, icono_base) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

        // Insertar el restaurante y obtener su ID
        const resultadoRestaurante = await client.query(consultaRestaurante, [nombre_restaurante, direccion, telefono, horario_atencion, coordenada_longitud, coordenada_latitud, valoracion, byteArray, icono_base]);
        console.log('RESTAURANTE REGISTRADO');
        const idRestaurante = resultadoRestaurante.rows[0].id_restaurante;

        // Consulta para insertar las etiquetas del restaurante en la tabla intermedia
        const consultaEtiquetas = `INSERT INTO etiqueta_restaurante (id_restaurante_etiquetado, id_etiqueta_restaurante) VALUES ($1, $2)`;

        // Insertar las etiquetas del restaurante
        for (const idEtiqueta of etiquetas) {
            await client.query(consultaEtiquetas, [idRestaurante, idEtiqueta]);
        }

        res.json({ message: 'Restaurante registrado correctamente' });
    } catch (error) {
        console.error('Error al agregar un nuevo restaurante:', error);
        res.status(500).json({ error: 'Error al agregar un nuevo restaurante' });
    }
});


app.post('/avistamientos-registrar', async (req, res) => {
    try {
        const { nombre_restaurante, foto, direccion, id_usuario_fk, coordenada_longitud, coordenada_latitud, icono } = req.body;
        if (!nombre_restaurante || !foto || !direccion || !id_usuario_fk || !coordenada_longitud || !coordenada_latitud || !icono) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const consulta = `INSERT INTO registro_avistamiento (nombre_restaurante, foto, direccion, id_usuario_fk, coordenada_longitud, coordenada_latitud, icono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

        // Convertir la foto base64 a formato de bytes
        const byteArray = Buffer.from(foto.split(',')[1], 'base64');

        const resultado = await client.query(consulta, [nombre_restaurante, byteArray, direccion, id_usuario_fk, coordenada_longitud, coordenada_latitud, icono]);

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar un nuevo avistamiento:', error);
        res.status(500).json({ error: 'Error al agregar un nuevo avistamiento' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
  });
