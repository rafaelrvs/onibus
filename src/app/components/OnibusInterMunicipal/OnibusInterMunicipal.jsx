"use client";

import React, { useEffect, useState } from "react";
import styles from "./OnibusInterMunicipal.module.css";

export default function OnibusInterMunicipal() {
  // estados de origens e destinos
  const [origens, setOrigens] = useState([]);
  const [destinos, setDestinos] = useState([]);

  // seleções do usuário
  const [selectedOrigem, setSelectedOrigem] = useState("");
  const [selectedDestino, setSelectedDestino] = useState("");

  // loading/erro destinos
  const [loadingDestinos, setLoadingDestinos] = useState(false);
  const [errorDestinos, setErrorDestinos] = useState(null);

  // itinerário (origem → destino)
  const [itinerarioData, setItinerarioData] = useState(null);
  const [loadingItinerario, setLoadingItinerario] = useState(false);
  const [errorItinerario, setErrorItinerario] = useState(null);

  // horários detalhados por linha
  const [detalhes, setDetalhes] = useState({});
  const [loadingDetalhes, setLoadingDetalhes] = useState({});
  const [errorDetalhes, setErrorDetalhes] = useState({});

  // URL do bustime para iframe
  const [bustimeUrl, setBustimeUrl] = useState({});
  const [loadingBustime, setLoadingBustime] = useState({});

  // 1) fetch origens
  useEffect(() => {
    async function fetchOrigens() {
      try {
        const res = await fetch("/api/OnibusInterMunicipal");
        if (!res.ok) throw new Error();
        setOrigens(await res.json());
      } catch {
        setOrigens([]);
      }
    }
    fetchOrigens();
  }, []);

  // 2) fetch destinos
  useEffect(() => {
    if (!selectedOrigem) {
      setDestinos([]);
      setSelectedDestino("");
      return;
    }
    async function fetchDestinos() {
      setLoadingDestinos(true);
      try {
        const res = await fetch(
          `/api/OnibusInterMunicipal/Destino?cidadede=${encodeURIComponent(selectedOrigem)}`
        );
        if (!res.ok) throw new Error();
        setDestinos(await res.json());
      } catch {
        setErrorDestinos("Não foi possível carregar destinos.");
        setDestinos([]);
      } finally {
        setLoadingDestinos(false);
      }
    }
    fetchDestinos();
  }, [selectedOrigem]);

  // 3) fetch itinerário
  useEffect(() => {
    if (!selectedOrigem || !selectedDestino) {
      setItinerarioData(null);
      return;
    }
    async function fetchItinerario() {
      setLoadingItinerario(true);
      try {
        const res = await fetch(
          `/api/OnibusInterMunicipal/Itinerario?cidadede=${encodeURIComponent(
            selectedOrigem
          )}&cidadeate=${encodeURIComponent(selectedDestino)}`
        );
        if (!res.ok) throw new Error();
        const { linhasEncontradas } = await res.json();
        setItinerarioData(linhasEncontradas);
      } catch {
        setErrorItinerario("Não foi possível carregar o itinerário.");
      } finally {
        setLoadingItinerario(false);
      }
    }
    fetchItinerario();
  }, [selectedOrigem, selectedDestino]);

  // 4) fetch detalhes horários
  async function loadDetalhes(numero, url) {
    setLoadingDetalhes(prev => ({ ...prev, [numero]: true }));
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error();
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = Array.from(doc.querySelectorAll("table.tabelaHorarios tr")).slice(1);
      const data = rows.map(tr => {
        const tds = tr.querySelectorAll("td");
        return { horario: tds[0].textContent.trim(), local: tds[1].textContent.trim() };
      });
      setDetalhes(prev => ({ ...prev, [numero]: data }));
    } catch {
      setErrorDetalhes(prev => ({ ...prev, [numero]: "Erro ao carregar horários" }));
    } finally {
      setLoadingDetalhes(prev => ({ ...prev, [numero]: false }));
    }
  }

  // 5) apenas monta a URL do bustime para iframe
  function showMapa(numero) {
    setBustimeUrl(prev => ({
      ...prev,
      [numero]: `https://bustime.noxxonsat.com.br/emtu/v4/emtu.html?linha=${encodeURIComponent(numero)}`
    }));
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Ônibus Intermunicipal</h1>

      {/* Origem */}
      <section className={styles.section}>
        <label htmlFor="trajetoEstouEm" className={styles.label}>1) Estou em:</label>
        <select
          id="trajetoEstouEm"
          className={styles.select}
          value={selectedOrigem}
          onChange={e => { setSelectedOrigem(e.target.value); setSelectedDestino(""); }}
        >
          <option value="">Selecione a cidade</option>
          {origens.map(o => (
            <option key={o.municipio} value={o.municipio}>{o.municipioComAcento}</option>
          ))}
        </select>
      </section>

      {/* Loading/Erro destinos */}
      {loadingDestinos && <p className={styles.infoText}>Carregando destinos…</p>}
      {errorDestinos && <p className={styles.errorText}>{errorDestinos}</p>}

      {/* Destino */}
      {selectedOrigem && !loadingDestinos && (
        <section className={styles.section}>
          <label htmlFor="trajetoQueroIrPara" className={styles.label}>2) Quero Ir Para:</label>
          <select
            id="trajetoQueroIrPara"
            className={styles.select}
            value={selectedDestino}
            onChange={e => setSelectedDestino(e.target.value)}
          >
            <option value="">Selecione a cidade</option>
            {destinos.length > 0 ? destinos.map(d => (
              <option key={d.municipio} value={d.municipio}>{d.municipioComAcento}</option>
            )) : <option value="">Nenhum resultado encontrado</option>}
          </select>
        </section>
      )}

      {/* Itinerário */}
      {selectedOrigem && selectedDestino && (
        <section className={styles.section}>
          <h2 className={styles.subHeader}>Itinerário para: <strong>{selectedOrigem} → {selectedDestino}</strong></h2>
          {loadingItinerario && <p className={styles.infoText}>Buscando itinerário…</p>}
          {errorItinerario && <p className={styles.errorText}>{errorItinerario}</p>}
          {itinerarioData && (
            <div className={styles.itinerarioContainer}>
              <table className={styles.table}>
                <thead>
                  <tr><th>Número</th><th>Descrição</th><th>Empresa</th><th>Valor</th><th>Integração</th><th>Mapa</th><th>Horários</th></tr>
                </thead>
                <tbody>
                  {itinerarioData.map(linha => (
                    <React.Fragment key={linha.numero}>
                      <tr>
                        <td>{linha.numero}</td>
                        <td>{linha.descricao}</td>
                        <td>{linha.empresa}</td>
                        <td>{linha.tarifa}</td>
                        <td>{linha.integracao}</td>
                        {/* Botão mapa */}
                        <td>
                          <button onClick={() => showMapa(linha.numero)}>
                            Ver mapa
                          </button>
                        </td>
                        {/* Botão horários */}
                        <td>
                          {linha.detailUrl ? (
                            <button onClick={() => loadDetalhes(linha.numero, linha.detailUrl)}>
                              Ver horários
                            </button>
                          ) : '—'}
                        </td>
                      </tr>

                      {/* Iframe isolado para mapa bustime, com referer correto */}
                      {bustimeUrl[linha.numero] && (
                        <tr>
                          <td colSpan={7} className={styles.mapContainer}>
                            <iframe
                              src={bustimeUrl[linha.numero]}
                              style={{ width: '100%', height: '400px', border: 'none' }}
                            />
                          </td>
                        </tr>
                      )}

                      {/* Exibe horários */}
                      {detalhes[linha.numero] && (
                        <tr>
                          <td colSpan={7}>
                            <table className={styles.table}>
                              <thead><tr><th>Horário</th><th>Ponto</th></tr></thead>
                              <tbody>
                                {detalhes[linha.numero].map((h, i) => (
                                  <tr key={i}><td>{h.horario}</td><td>{h.local}</td></tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}