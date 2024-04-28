"use client";
import { useEffect, useState } from "react";
import Header from "../principal/Header";
import PiePagina from "../principal/piePagina";
import { cargarRestaurantesConEtiqueta } from "../utiles/consultores/restaurantes";
import ListaLocales from "../elementos/ListaLocales";
const Page = () => {

  return ( 
    <div className="overflow-hidden">
      <Header />
      <ListaLocales etiqueta="bar"/>
      <PiePagina />
    </div>
  );
};

export default Page;