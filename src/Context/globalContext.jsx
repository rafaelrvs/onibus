// src/app/context/GlobalContext.jsx
'use client'

import React, { createContext, useState } from 'react'

// Cria o contexto sem genéricos nem tipos
export const GlobalContext = createContext({
  activeTab: 'inicio',
  setActiveTab: () => {}
})

// Provider sem anotações de tipo
export function GlobalProvider({ children }) {
  const [activeTab, setActiveTab] = useState('inicio')

  return (
    <GlobalContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </GlobalContext.Provider>
  )
}
