"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./ModalForms.module.css";
import { linhasOnibus } from "@/app/data/linhasOnibus";
import { ativaFrame } from "@/app/data/utils";
import mapa from "@/app/data/mapa";
import axios from "axios";
import BotaoGetAudio from "@/app/utils/BotaoGetAudio";

const LoadingSpinner = () => (
  <div className={styles.loadingSpinner}></div>
);

export default function ModalFormsOnibus() {
  const [inputPesquisa, setInputPesquisa] = useState("C002B");
  const [onibus, setOnibus] = useState("");
  const [result, setResult] = useState("");
  const [linkframe, setLinkframe] = useState("");
  const [isButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1) Memoizamos toda a lógica de busca
  const handleSearch = useCallback(async (linha) => {
    setIsLoading(true);
    try {
      // Insere o ônibus
      const found = linhasOnibus.find((item) => {
        const [codigo] = item.split(" - ");
        return codigo.trim().toUpperCase() === linha.trim().toUpperCase();
      });
      if (found) {
        setOnibus(found);
      } else {
        setResult("Nenhuma linha encontrada.");
        return;
      }

      // Atualiza o frame do mapa
      ativaFrame(linha, mapa, setLinkframe);

      // Busca horários
      const { data } = await axios.get(
        `https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${linha}`
      );
      if (!data.horarios || Object.keys(data.horarios).length === 0) {
        setResult("Horários não encontrados.");
        return;
      }

      setResult("Consultando o próximo horário de ônibus...");

      // Envia para análise
      const { data: analyzeData } = await axios.post(
        "https://api-bus-g6pv.onrender.com/analyze",
        {
          codigo: linha,
          horarios: data.horarios,
          horarioAgora: new Date().toLocaleTimeString(),
        }
      );
      setResult(analyzeData?.resposta || "Resposta não encontrada");
    } catch (err) {
      setResult("Erro ao processar a solicitação.");
    } finally {
      setIsLoading(false);
    }
  }, []); // nenhum state interno varia — imports e setters do React são estáveis

  // 2) Efeito dispara só quando `inputPesquisa` (ou `handleSearch`) muda
  useEffect(() => {
    if (inputPesquisa) {
      handleSearch(inputPesquisa);
    }
  }, [inputPesquisa, handleSearch]);

  const handleSelectChange = (e) => {
    const [codigo] = e.target.value.split(" - ");
    setInputPesquisa(codigo.trim());
  };

  const handleButtonClick = () => {
    if (!inputPesquisa) {
      alert("Por favor, selecione o código da linha de ônibus.");
      return;
    }
    handleSearch(inputPesquisa);
  };

  return (
    <div className={styles.ModalFormChat}>
      <h1 className={styles.containerTitleModal}>Consulte seu Ônibus</h1>
      <div className={styles.containerBtnModal}>
        <select
          className={styles.option}
          onChange={handleSelectChange}
          value={inputPesquisa}
        >
          {linhasOnibus.map((linha, idx) => (
            <option key={idx} value={linha}>
              {linha}
            </option>
          ))}
        </select>

        <div className={styles.Result}>
          {isLoading ? <LoadingSpinner /> : <p>{result}</p>}
        </div>

        <BotaoGetAudio text={result} />

        <input
          type="button"
          value="Buscar"
          disabled={isButtonDisabled}
          className={
            isButtonDisabled
              ? styles.buttonConsultarDisable
              : styles.buttonConsultar
          }
          onClick={handleButtonClick}
        />

        {linkframe && (
          <iframe
            className={styles.frame}
            src={linkframe}
            frameBorder="0"
            title="Mapa do ônibus"
          />
        )}
      </div>
    </div>
  );
}
