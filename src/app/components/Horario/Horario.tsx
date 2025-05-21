// src/app/components/Horario/Horario.jsx
'use client';

import React, { useEffect, useState } from 'react';
import styles from './Horario.module.css';

export default function Horario() {
  const [aba, setAba] = useState('diasUteis');        // 'diasUteis' | 'sabados' | 'domingos'
  const [sentido, setSentido] = useState('Terminal → Centro');
  const [linhas, setLinhas] = useState([]);           // aqui guardamos os números de linha

  const tabs = [
    { key: 'diasUteis', label: 'Dias Úteis' },
    { key: 'sabados',   label: 'Sábados' },
    { key: 'domingos',  label: 'Domingos' }
  ];

  const horarios = {
    diasUteis: ['05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30'],
    sabados:   ['06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30'],
    domingos:  ['07:00','07:30','08:00','08:30','09:00','09:30']
  };

  // Dispara a busca das linhas só uma vez, ao montar o componente
  useEffect(() => {
    async function fetchLinhas() {
      try {
        // Aponta para o seu endpoint interno (criado em app/api/linhas/route.js)
        const res = await fetch('/api/linhas');
        if (!res.ok) throw new Error('Erro ao buscar linhas');
        const data = await res.json();
        // Extrai apenas o número de cada linha
        setLinhas(data.linhas.map(item => item.linha));
      } catch (err) {
        console.error('Erro ao buscar linhas:', err);
      }
    }
    fetchLinhas();
  }, []);  // array de deps vazio: roda apenas no mount

  function trocarSentido() {
    setSentido(prev =>
      prev === 'Terminal → Centro'
        ? 'Centro → Terminal'
        : 'Terminal → Centro'
    );
  }

  return (
    <div className={styles.container}>
      {/* --- Linhas carregadas --- */}
      {linhas.length > 0 && (
        <div className={styles.linhasDisponiveis}>
          <strong>Linhas disponíveis:</strong>{' '}
          {linhas.join(', ')}
        </div>
      )}

      {/* --- Abas de dias --- */}
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${aba === t.key ? styles.active : ''}`}
            onClick={() => setAba(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* --- Sentido --- */}
      <div className={styles.sentido}>
        <span>Sentido: {sentido}</span>
        <button onClick={trocarSentido} className={styles.link}>
          Ver outro sentido
        </button>
      </div>

      {/* --- Grade de horários --- */}
      <div className={styles.grade}>
        {horarios[aba].map(h => (
          <div key={h} className={styles.item}>
            {h}
          </div>
        ))}
      </div>

      {/* --- Botão ver todos --- */}
      <button className={styles.verTodos}>
        Ver todos os horários
      </button>
    </div>
  );
}
