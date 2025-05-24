import React, { useEffect, useState, useMemo } from 'react';
import styles from './Horario.module.css';

export default function Horario() {
  const [aba, setAba] = useState('diasUteis');        // 'diasUteis' | 'sabados' | 'domingos'
  const [sentido, setSentido] = useState('a');         // 'a' = partida_a | 'b' = partida_b
  const [linhas, setLinhas] = useState([]);              // agora guarda objetos completos
  const [inputValue, setInputValue] = useState('');      // valor digitado pelo usuário
  const [selectedLinha, setSelectedLinha] = useState('');
  const [horariosData, setHorariosData] = useState({
    diasUteis: [], sabados: [], domingos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { key: 'diasUteis', label: 'Dias Úteis' },
    { key: 'sabados',   label: 'Sábados' },
    { key: 'domingos',  label: 'Domingos' }
  ];

  // 1️⃣ Busca todas as linhas ao montar (inclui nome e código)
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

  // 2️⃣ Filtra linhas por código ou nome com base no input
  const filteredLinhas = useMemo(() => {
    const term = inputValue.toLowerCase();
    return linhas.filter(item =>
      item.linha.toLowerCase().includes(term) ||
      item.nome.toLowerCase().includes(term)
    );
  }, [linhas, inputValue]);

  // 3️⃣ Atualiza selectedLinha quando o input bate exatamente com um código
  useEffect(() => {
    if (linhas.some(item => item.linha === inputValue)) {
      setSelectedLinha(inputValue);
    }
  }, [inputValue, linhas]);

  // 4️⃣ Busca horários sempre que mudar a linha selecionada
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
      {/* Seleção de linha (código filtrado por nome ou código) */}
      {linhas.length > 0 && (
        <div className={styles.linhasDisponiveis}>
          <strong>Selecione ou digite a linha:</strong>{' '}
          <input
            type="text"
            list="linhas-list"
            value={inputValue}
            onChange={e => setInputValue(e.target.value.toUpperCase())}
            className={`form-control ${styles.selectLinha}`}
            placeholder="Ex: C002A ou Circular"
          />
          <datalist id="linhas-list">
            {filteredLinhas.map(item => (
              <option
                key={item.linha}
                value={item.linha}
                label={item.nome}
              />
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
    </div>
  );
}
