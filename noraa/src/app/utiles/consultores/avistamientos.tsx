// consultasAvistamientos.ts

export async function cargarAvistamientos(): Promise<any[]> {
  try {
    const response = await fetch('http://localhost:5000/avistamientos');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los avistamientos:', error);
    // Aquí podrías manejar el error de alguna manera, si es necesario
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

// Otras funciones relacionadas con consultas de avistamientos...
