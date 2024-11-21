"use client";
import React, { useEffect, useState } from 'react';
import styles from './ModalForms.module.css';
import { linhasOnibus } from '@/app/data/linhasOnibus';
import { ativaFrame } from '@/app/data/utils';
import mapa from '@/app/data/mapa';
import axios from 'axios';

const ModalFormsOnibus = () => {
    const [inputPesquisa, setInputPesquisa] = useState('Selecione a linha de onibus');
    const [insireCEP, setInsireCEP] = useState('Insira seu CEP');
    const [onibus, setOnibus] = useState('');
    const [result, SetResult] = useState('');
    const [linkframe, setLinkframe] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const dataAtual = new Date().toLocaleTimeString(); // Formata o horário atual

    const handleSelectChange = (e) => {

        const [codigo] = e.target.value.split('-');


        setInputPesquisa(codigo);

    };
    useEffect(() => {
        insereOnibus()

    }, [inputPesquisa])

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
            SetResult('Nenhuma linha encontrada.');
        }
    }
    const handleButtonClick = () => {

        console.log(inputPesquisa);
        insereOnibus()

        setIsButtonDisabled(true)
        setIsLoading(true); // Ativa o estado de carregamento
        setTimeout(() => {
            setIsButtonDisabled(false);
            setIsLoading(false); // Desativa o estado de carregamento após 2 segundos

            setIsButtonDisabled(false)

        }, 2000)

        const inputUsuario = inputPesquisa.trim().toUpperCase();

        if (inputUsuario.length === 0) {
            alert("Por favor, digite o código da linha de ônibus.");
            return;
        }

        ativaFrame(inputUsuario, mapa, setLinkframe)

        // axios.get(`https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${inputUsuario.trim()}`)
        axios.get(`https://api-bus-g6pv.onrender.com/escolhaOnibus?codigo=${inputUsuario.trim()}`)
            .then((response) => {
                const data = response.data;
                enviaParaServidor(data);



            })
            .catch((error) => {

                SetResult('Não possui cadstro de horarios quer consultar outros onibus?');
            })
            .finally(() => {
                setTimeout(() => setIsButtonDisabled(false), 3000);
            });



    }


    function formataHorariosParaEnvio(horarios) {
        return Object.keys(horarios).map(dia => {
            const horas = horarios[dia].join(', ');
            return `${dia}: ${horas}`;
        }).join(' | ');
    };




    const enviaParaServidor = (dados) => {



        if (!dados.horarios || Object.keys(dados.horarios).length === 0) {
            console.error('Horários não encontrados:', dados); // Verifica se os horários estão presentes
            SetResult('Horários não encontrados.');
            return;
        }

        const horariosFormatados = formataHorariosParaEnvio(dados.horarios);



        SetResult('Consultando o próximo horário de ônibus...');



        // axios.post('https://api-bus-g6pv.onrender.com/analyze', {
        axios.post('https://api-bus-g6pv.onrender.com/analyze', {
            codigo: inputPesquisa,
            horarios: dados.horarios,
            horarioAgora: dataAtual


        })

            .then((response) => {
                console.log(response);

                const resposta = response.data?.resposta || 'Resposta não encontrada';
                SetResult(resposta); // Exibir a resposta da API do Chat
            })
            .catch((error) => {
                console.error('Erro ao enviar para o servidor:', error);
                SetResult('Erro ao processar a solicitação.');
            });
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
                <input
                    type="text"
                    placeholder={"Digite seu onibus"}
                    value={insireCEP}
                    onChange={(e) => setInsireCEP(e.target.value)}
                    className={styles.inputPEsquisa}

                />
                <div className={styles.resultado}>
                </div>
                <div className={styles.Result}>
                    {isLoading ? (
                        <div className={styles.loadingSpinner}></div> // Mostra o spinner durante o carregamento
                    ) : (
                        <p className={styles.Result}>
                            {result}
                        </p>
                    )}
                </div>
                <input
                    onClick={handleButtonClick}

                    className={isButtonDisabled ? styles.buttonConsultarDisable : styles.buttonConsultar} type="button" value="Buscar" />
                <iframe className={styles.frame} src={linkframe} frameBorder="0" title="Mapa do ônibus"></iframe>
            </div>
        </div>
    );
};

export default ModalFormsOnibus;
