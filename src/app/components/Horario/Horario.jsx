
import React, { useEffect, useState } from 'react';
import styles from './Horario.module.css';

export default function Horario() {
  const [aba, setAba] = useState('diasUteis');        // 'diasUteis' | 'sabados' | 'domingos'
  const [sentido, setSentido] = useState('a');         // 'a' = partida_a | 'b' = partida_b
  const [linhas, setLinhas] = useState([]);
  const [selectedLinha, setSelectedLinha] = useState('');
  const [horariosData, setHorariosData] = useState({
    diasUteis: [],
    sabados: [],
    domingos: []
  });
  const [loading, setLoading] = useState(true); // inicia carregando
  const [error, setError] = useState(null);

  const tabs = [
    { key: 'diasUteis', label: 'Dias Úteis' },
    { key: 'sabados',   label: 'Sábados' },
    { key: 'domingos',  label: 'Domingos' }
  ];

  // 1️⃣ Busca todas as linhas ao montar
  useEffect(() => {
    async function fetchLinhas() {
      try {
        const res = await fetch('/api/linhas');
        if (!res.ok) throw new Error('Erro ao buscar linhas');
        const data = await res.json();
        const codigos = data.linhas.map(item => item.linha);
        setLinhas(codigos);
        if (codigos.length) setSelectedLinha(codigos[0]);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar as linhas.');
      }
    }
    fetchLinhas();
  }, []);

  // 2️⃣ Busca horários sempre que mudar a linha
  useEffect(() => {
    if (!selectedLinha) return;
    async function fetchHorarios() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/horarios/${selectedLinha}`);
        if (!res.ok) throw new Error('Erro ao buscar horários');
        const data = await res.json();
        setHorariosData({
          diasUteis: data.diasUteis || [],
          sabados:   data.sabados   || [],
          domingos:  data.domingos  || []
        });
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os horários.');
      } finally {
        setLoading(false);
      }
    }
    fetchHorarios();
  }, [selectedLinha]);

  function trocarSentido() {
    setSentido(prev => (prev === 'a' ? 'b' : 'a'));
  }

  return (
    <div className={styles.container}>
      {/* Seleção de linha */}
      {linhas.length > 0 && (
        <div className={styles.linhasDisponiveis}>
          <strong>Selecione ou digite a linha:</strong>{' '}
          <input
            type="text"
            list="linhas-list"
            value={selectedLinha}
            onChange={e => setSelectedLinha(e.target.value.toUpperCase())}
            className={`form-control ${styles.selectLinha}`}
            placeholder="Ex: C002A"
          />
          <datalist id="linhas-list">
            {linhas.map(l => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
      )}

      {/* Abas de dias */}
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

      {/* Sentido */}
      <div className={styles.sentido}>
        <span>
          <strong>Sentido:</strong>{' '}
          {sentido === 'a'
            ? 'Terminal → Centro'
            : 'Centro → Terminal'}
        </span>
        <button onClick={trocarSentido} className={styles.link}>
          Ver outro sentido
        </button>
      </div>

      {/* Grade de horários */}
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner} aria-label="Carregando" />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.grade}>
          {horariosData[aba]
            .map((entry, idx) => {
              const hora = typeof entry === 'string'
                ? entry
                : entry.hora;
              return (
                <div key={idx} className={styles.item}>
                  {hora}
                </div>
              );
            })}
        </div>
      )}

      {/* Ver todos os horários (JSON) */}
      {/* <div className={styles.verTodos}>
        <a
          href={`/api/horarios/${selectedLinha}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Ver todos os horários (JSON)
        </a>
      </div> */}
    </div>
  );
}