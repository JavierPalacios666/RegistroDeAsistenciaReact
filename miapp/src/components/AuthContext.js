import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  noControl: null,
  setNoControl: () => {},
});

export const AuthProvider = ({ children }) => {
  const [noControl, setNoControl] = useState(localStorage.getItem('noControl') || null);

  useEffect(() => {
    if (noControl) {
      localStorage.setItem('noControl', noControl);
    } else {
      localStorage.removeItem('noControl');
    }
  }, [noControl]);

  return (
    <AuthContext.Provider value={{ noControl, setNoControl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
