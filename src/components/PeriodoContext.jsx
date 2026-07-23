import React, { createContext, useState, useEffect, useContext } from 'react';

const PeriodoContext = createContext();

const DEFAULT_PERIODO = {
  mesActivo: 'Julio 2026',
  fechaLimite: '2026-08-05T23:59:00',
  habilitado: true,
  formatos: [
    { nombre: 'Formato GTH-F-062 V10 (GC)', tipo: 'GC' },
    { nombre: 'Formato GF (Gestión Financiera)', tipo: 'GF' }
  ]
};

export function PeriodoProvider({ children }) {
  const [periodoInfo, setPeriodoInfo] = useState(() => {
    const saved = localStorage.getItem('stimi_periodo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PERIODO;
      }
    }
    return DEFAULT_PERIODO;
  });

  const updatePeriodo = (newInfo) => {
    const updated = { ...periodoInfo, ...newInfo };
    setPeriodoInfo(updated);
    localStorage.setItem('stimi_periodo', JSON.stringify(updated));
  };

  return (
    <PeriodoContext.Provider value={{ periodoInfo, updatePeriodo }}>
      {children}
    </PeriodoContext.Provider>
  );
}

export function usePeriodo() {
  const context = useContext(PeriodoContext);
  if (!context) {
    throw new Error('usePeriodo debe usarse dentro de un PeriodoProvider');
  }
  return context;
}
