import Header from './Header';
import Footer from './Footer';
import {useLocation} from 'react-router-dom'
import React, { useEffect, useState, createContext } from 'react';

export default function Layout({ children }) {

  const location = useLocation();
  const userId = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null;


  return (
    <>
          <Header /> 
          {children}
          <Footer />
    </>
  );
}
