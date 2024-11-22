import React, { useEffect, useState } from 'react';
import styles from './ModalForms.module.css';
import { linhasOnibus } from '@/app/data/linhasOnibus';
import { ativaFrame } from '@/app/data/utils';
import mapa from '@/app/data/mapa';
import axios from 'axios';
import BotaoGetAudio from '@/app/utils/BotaoGetAudio';

const ModalFormsOnibus = () => {
    const [inputPesquisa, setInputPesquisa] = useState('Selecione a linha de onibus');
    const [onibus, setOnibus] = useState('');
    const [result, setResult] = useState('');
    const [linkframe, setLinkframe] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dataAtual = new Date().toLocaleTimeString(); // Formata o horário atual


    
    const handleSelectChange = (e) => {
        const [codigo] = e.target.value.split('-');
        setInputPesquisa(codigo);
  
    };
    
    useEffect(() => {
        insereOnibus();
    }, [inputPesquisa]);
    
    function insereOnibus() {
        const resultado = linhasOnibus.filter(item => {
            const [codigo, nomeOnibus] = item.split(' - ');
            // Verifica se o código ou o nome do ônibus contém o termo de pesquisa
            return (
                codigo.trim().toUpperCase().includes(inputPesquisa.trim().toUpperCase()) ||
                (nomeOnibus && nomeOnibus.trim().toUpperCase().includes(inputPesquisa.trim().toUpperCase()))
            );
        });
        console.log(resultado);
        if (resultado.length > 0) {
            setOnibus(resultado[0]); // Define a primeira linha encontrada como resultado
        } else {
            setResult('Nenhuma linha encontrada.');
        }
    }
    
    const handleButtonClick = () => {
        console.log(inputPesquisa);
        insereOnibus();
        
        setIsButtonDisabled(true);
        setIsLoading(true); // Ativa o estado de carregamento
        setTimeout(() => {
            setIsButtonDisabled(false);
            setIsLoading(false); // Desativa o estado de carregamento após 2 segundos
        }, 2000);
        
        const inputUsuario = inputPesquisa.trim().toUpperCase();
        
        if (inputUsuario.length === 0) {
            alert("Por favor, digite o código da linha de ônibus.");
            return;
        }
        
        ativaFrame(inputUsuario, mapa, setLinkframe);
        
        axios.get(`https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${inputUsuario.trim()}`)
        .then((response) => {
            const data = response.data;
            enviaParaServidor(data);
        })
        .catch((error) => {
            setResult('Não possui cadastro de horários. Quer consultar outros ônibus?');
        })
        .finally(() => {
            setTimeout(() => setIsButtonDisabled(false), 3000);
        });
    };
    
    const enviaParaServidor = (dados) => {
        if (!dados.horarios || Object.keys(dados.horarios).length === 0) {
            console.error('Horários não encontrados:', dados); // Verifica se os horários estão presentes
            setResult('Horários não encontrados.');
            return;
        }
        
        const horariosFormatados = formataHorariosParaEnvio(dados.horarios);
        
        setResult('Consultando o próximo horário de ônibus...');
        
        axios.post('https://api-bus-g6pv.onrender.com/analyze', {
            codigo: inputPesquisa,
            horarios: dados.horarios,
            horarioAgora: dataAtual
        })
        .then((response) => {
            console.log(response);
            const resposta = response.data?.resposta || 'Resposta não encontrada';
            setResult(resposta);
        })
        .catch((error) => {
            console.error('Erro ao enviar para o servidor:', error);
            setResult('Erro ao processar a solicitação.');
        });
    };
    
    function formataHorariosParaEnvio(horarios) {
        return Object.keys(horarios).map(dia => {
            const horas = horarios[dia].join(', ');
            return `${dia}: ${horas}`;
        }).join(' | ');
    }
    
  
    
    
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

                <div className={styles.resultado}></div>
                <div className={styles.Result}>
                    {isLoading ? (
                        <div className={styles.loadingSpinner}></div> // Mostra o spinner durante o carregamento
                    ) : (
                        <p className={styles.Result}>
                            {result}
                        </p>
                    )}
                </div>
                <BotaoGetAudio text={result} />
                <input
                    onClick={handleButtonClick}
                    className={isButtonDisabled ? styles.buttonConsultarDisable : styles.buttonConsultar}
                    type="button"
                    value="Buscar"
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
