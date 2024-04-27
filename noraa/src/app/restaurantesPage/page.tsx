import ListaLocales from "../elementos/ListaLocales";
import Header from "../principal/Header";
import PiePagina from "../principal/piePagina";

const Page = () => {

  return ( 
    <div className="overflow-hidden">
      <Header />
      <ListaLocales etiqueta="restaurante"/>
      <PiePagina />
    </div>
  );
};

export default Page;