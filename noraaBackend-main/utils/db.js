const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "hans2003",
    database: "noraadb"
});

// Conexión a la base de datos
client.connect();

// Función para obtener los restaurantes
const obtenerRestaurantes = async () => {
    console.log('RESTAURANTES EN BÚSQUEDA');

    try {
        const consulta = 'SELECT * FROM "public"."restaurante"';
        console.log('Iniciando consulta...');
        const resultado = await client.query(consulta);
        return resultado.rows;
    } catch (error) {
        console.log('Error al obtener restaurantes:', error);
        throw error; // Re-lanzamos el error para manejarlo donde sea necesario
    };
};

module.exports = { client, obtenerRestaurantes };
