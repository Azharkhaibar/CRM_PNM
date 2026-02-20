import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const GlassEffectContext = createContext();

export const GlassEffectProvider = ({ children }) => {
  const [glassEnabled, setGlassEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glassEnabled');
      return saved !== 'false'; // default to true
    }
    return true;
  });

  const [glassIntensity, setGlassIntensity] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glassIntensity');
      return saved || 'medium';
    }
    return 'medium';
  });

  useEffect(() => {
    localStorage.setItem('glassEnabled', glassEnabled);
  }, [glassEnabled]);

  useEffect(() => {
    localStorage.setItem('glassIntensity', glassIntensity);
  }, [glassIntensity]);

  const toggleGlass = () => {
    setGlassEnabled((prev) => !prev);
  };

  const value = useMemo(
    () => ({ glassEnabled, setGlassEnabled, toggleGlass, glassIntensity, setGlassIntensity }),
    [glassEnabled, glassIntensity]
  );

  return <GlassEffectContext.Provider value={value}>{children}</GlassEffectContext.Provider>;
};

export const useGlassEffect = () => {
  const context = useContext(GlassEffectContext);
  if (!context) {
    throw new Error('useGlassEffect must be used within a GlassEffectProvider');
  }
  return context;
};
