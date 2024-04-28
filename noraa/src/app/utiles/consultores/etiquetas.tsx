export async function cargarEtiquetas(): Promise<any[]> {
    try {
      const response = await fetch('http://localhost:5000/etiquetas');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al cargar las etiquetas:', error);
      throw error; // También puedes lanzar el error para que sea manejado por el llamador de la función
    }
  }