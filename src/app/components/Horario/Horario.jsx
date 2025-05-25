import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from './Horario.module.css';
import { Loader2 } from 'lucide-react';

export default function Horario() {
  const [aba, setAba] = useState('diasUteis');
  const [sentido, setSentido] = useState('a');
  const [linhas, setLinhas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [selectedLinha, setSelectedLinha] = useState('');
  const [horariosData, setHorariosData] = useState({ diasUteis: [], sabados: [], domingos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const suggestionsRef = useRef(null);

  const tabs = [
    { key: 'diasUteis', label: 'Dias Úteis' },
    { key: 'sabados',   label: 'Sábados'   },
    { key: 'domingos',  label: 'Domingos'  }
  ];

  useEffect(() => {
    async function fetchLinhas() {
      try {
        const res = await fetch('/api/linhas');
        if (!res.ok) throw new Error('Erro ao buscar linhas');
        const data = await res.json();
        setLinhas(data.linhas);
        if (data.linhas.length) {
          const primeira = data.linhas[0].linha;
          setInputValue(primeira);
          setSelectedLinha(primeira);
        }
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar as linhas.');
      }
    }
    fetchLinhas();
  }, []);

  const nameSuggestions = useMemo(() => {
    const term = nameSearch.toLowerCase();
    return linhas.filter(item =>
      item.nome.toLowerCase().includes(term)
    );
  }, [linhas, nameSearch]);

  // Quando seleciona sugestão de nome
  function selectByName(item) {
    setNameSearch(item.nome);
    setInputValue(item.linha);
    setSelectedLinha(item.linha);
    // limpa sugestões
    if (suggestionsRef.current) suggestionsRef.current.blur();
  }

  // completar ao pressionar espaço
  function handleNameKeyDown(e) {
    if (e.key === ' ' && nameSuggestions.length > 0) {
      e.preventDefault();
      selectByName(nameSuggestions[0]);
    }
  }

  // Filtra linhas por código e nome (para autocomplete código)
  const filteredLinhas = useMemo(() => {
    const codeTerm = inputValue.toLowerCase();
    const nameTerm = nameSearch.toLowerCase();
    return linhas.filter(item => {
      const matchesCode = !codeTerm || item.linha.toLowerCase().includes(codeTerm);
      const matchesName = !nameTerm || item.nome.toLowerCase().includes(nameTerm);
      return matchesCode && matchesName;
    });
  }, [linhas, inputValue, nameSearch]);

  useEffect(() => {
    if (linhas.some(item => item.linha === inputValue)) {
      setSelectedLinha(inputValue);
    }
  }, [inputValue, linhas]);

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
      {/* Busca pelo nome com sugestões custom */}
      <div className={styles.searchContainer}>
        <label htmlFor="searchName" className={styles.label}>
          Pesquisar pelo nome:
        </label>
        <input
          id="searchName"
          type="text"
          ref={suggestionsRef}
          value={nameSearch}
          onChange={e => setNameSearch(e.target.value)}
          onKeyDown={handleNameKeyDown}
          className={`${styles.searchInput} form-control`}
          placeholder="Digite parte do nome do ônibus"
          autoComplete="off"
        />
        {nameSearch && nameSuggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {nameSuggestions.slice(0, 5).map(item => (
              <li
                key={item.linha}
                className={styles.suggestionItem}
                onMouseDown={() => selectByName(item)}
              >
                {item.nome}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input para buscar pelo código */}
      {linhas.length > 0 && (
        <div className={styles.searchContainer}>
          <label htmlFor="searchCode" className={styles.label}>
            Pesquisar pelo código:
          </label>
          <input
            id="searchCode"
            type="text"
            list="linhas-list"
            value={inputValue}
            onChange={e => setInputValue(e.target.value.toUpperCase())}
            className={`${styles.selectLinha} form-control`}
            placeholder="Ex: C002A"
          />
          <datalist id="linhas-list">
            {filteredLinhas.map(item => (
              <option key={item.linha} value={item.linha} label={item.nome} />
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
          {sentido === 'a' ? 'Terminal → Centro' : 'Centro → Terminal'}
        </span>
        <button onClick={trocarSentido} className={styles.link}>
          Ver outro sentido
        </button>
      </div>

      {/* Grade de horários */}
      {loading ? (
        <div className={styles.spinnerContainer}>
            <div className={styles.loading}>
              <Loader2 className={styles.spinner} />
            </div>  
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.grade}>
          {horariosData[aba].map((entry, idx) => {
            const hora = typeof entry === 'string' ? entry : entry.hora;
            return (
              <div key={idx} className={styles.item}>
                {hora}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
