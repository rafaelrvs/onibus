import React, { useEffect, useState } from 'react';
import styles from './ModalForms.module.css';
import { linhasOnibus } from '@/app/data/linhasOnibus';
import { ativaFrame } from '@/app/data/utils';
import mapa from '@/app/data/mapa';
import axios from 'axios';
import BotaoGetAudio from '@/app/utils/BotaoGetAudio';

const LoadingSpinner = () => (
  <div className={styles.loadingSpinner}></div>
);

const ModalFormsOnibus = () => {
  const [inputPesquisa, setInputPesquisa] = useState('C002B'); // Valor padrão da linha
  const [onibus, setOnibus] = useState('');
  const [result, setResult] = useState('');
  const [linkframe, setLinkframe] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dataAtual = new Date().toLocaleTimeString();

  // Dispara a busca automaticamente ao carregar a página
  useEffect(() => {
    if (inputPesquisa) {
      handleSearch(inputPesquisa);
    }
  }, [inputPesquisa]);

  const handleSelectChange = (e) => {
    const [codigo] = e.target.value.split('-');
    setInputPesquisa(codigo.trim());
  };

  const handleSearch = async (linha) => {
    setIsLoading(true);

    try {
      insereOnibus(linha);
      ativaFrame(linha, mapa, setLinkframe);

      const response = await axios.get(
        `https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${linha}`
      );
      const data = response.data;
      await enviaParaServidor(data);
    } catch (error) {
      setResult('Não possui cadastro de horários. Quer consultar outros ônibus?');
    } finally {
      setIsLoading(false);
    }
  };

  const insereOnibus = (linha) => {
    const resultado = linhasOnibus.find((item) => {
      const [codigo, nomeOnibus] = item.split(' - ');
      return codigo.trim().toUpperCase() === linha.trim().toUpperCase();
    });

    if (resultado) {
      setOnibus(resultado);
    } else {
      setResult('Nenhuma linha encontrada.');
    }
  };

  const handleButtonClick = () => {
    if (inputPesquisa === 'Selecione a linha de ônibus' || inputPesquisa.trim() === '') {
      alert('Por favor, selecione o código da linha de ônibus.');
      return;
    }

    handleSearch(inputPesquisa);
  };

  const enviaParaServidor = async (dados) => {
    if (!dados.horarios || Object.keys(dados.horarios).length === 0) {
      setResult('Horários não encontrados.');
      return;
    }

    setResult('Consultando o próximo horário de ônibus...');

    try {
      const response = await axios.post('https://api-bus-g6pv.onrender.com/analyze', {
        codigo: inputPesquisa,
        horarios: dados.horarios,
        horarioAgora: dataAtual,
      });
      const resposta = response.data?.resposta || 'Resposta não encontrada';
      setResult(resposta);
    } catch (error) {
      setResult('Erro ao processar a solicitação.');
    }
  };

  return (
    <div className={styles.ModalFormChat}>
      <h1 className={styles.containerTitleModal}>Consulte seu Ônibus</h1>
      <div className={styles.containerBtnModal}>
        <select className={styles.option} onChange={handleSelectChange} value={inputPesquisa}>
          <option className={styles.option} value="">
            {inputPesquisa}
          </option>
          {linhasOnibus.map((linha, index) => (
            <option key={index} value={linha}>
              {linha}
            </option>
          ))}
        </select>

        <div className={styles.Result}>
          {isLoading ? <LoadingSpinner /> : <p>{result}</p>}
        </div>
        <BotaoGetAudio text={result} />
        <input
          onClick={handleButtonClick}
          className={
            isButtonDisabled ? styles.buttonConsultarDisable : styles.buttonConsultar
          }
          type="button"
          value="Buscar"
          disabled={isButtonDisabled}
        />
        {linkframe && (
          <iframe
            className={styles.frame}
            src={linkframe}
            frameBorder="0"
            title="Mapa do ônibus"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default ModalFormsOnibus;
