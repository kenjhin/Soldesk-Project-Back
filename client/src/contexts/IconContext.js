import React, { createContext, useContext, useState } from 'react';

const IconContext = createContext();

export const useIcon = () => useContext(IconContext);

export const IconProvider = ({ children }) => {
  const [icons, setIcons] = useState([]);

  return (
    <IconContext.Provider value={{ icons, setIcons }}>
      {children}
    </IconContext.Provider>
  );
};