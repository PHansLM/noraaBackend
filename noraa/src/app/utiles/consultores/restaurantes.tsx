// consultasRestaurantes.ts

export async function cargarCercanos(lat: number, lng: number): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:5000/restaurantes-cercanos?latitud=${lat}&longitud=${lng}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los restaurantes cercanos:', error);
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

export async function cargarCercanosLimitados(lat: number, lng: number, limite: number): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:5000/restaurantes-cercanos-limitados?latitud=${lat}&longitud=${lng}&limite=${limite}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los restaurantes cercanos:', error);
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

export async function cargarRestaurantes(): Promise<any[]> {
  try {
    const response = await fetch('http://localhost:5000/restaurantes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los restaurantes:', error);
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

export async function cargarRestaurantesConFiltro(filtro: string): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:5000/restaurantes-filtrar?filtro=${filtro}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los restaurantes:', error);
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

export async function cargarRestaurantesConEtiqueta(etiqueta: string): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:5000/restaurantes-por-etiqueta?etiqueta=${etiqueta}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar los restaurantes:', error);
    throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
  }
}

// Otras funciones relacionadas con consultas de restaurantes...
