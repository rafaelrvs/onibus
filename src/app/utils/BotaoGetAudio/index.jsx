"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { urlTSS } from "../urls";

function BotaoGetAudio({ text }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null); // Referência para o elemento <audio>

  // useEffect para atualizar o áudio automaticamente sempre que o texto mudar
  useEffect(() => {
    if (text && text.trim() !== "" && text !== audioSrc) {
      gerarAudio(text);
    }
  }, [text]); // Observa mudanças no `text`

  // useEffect para reproduzir automaticamente quando a fonte do áudio é alterada
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load(); // Recarregar a fonte do áudio
      audioRef.current.play().catch((error) => {
        console.error("Erro ao reproduzir o áudio automaticamente:", error);
      });
    }
  }, [audioSrc]);

  const gerarAudio = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        urlTSS + "/synthesize",
        { text: text.substring(0, 1000) },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const audioURL = URL.createObjectURL(response.data);
      setAudioSrc(audioURL);
    } catch (e) {
      console.error("Erro ao gerar áudio:", e);
      setError("Erro ao gerar áudio. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {audioSrc ? (
        <audio ref={audioRef} key={audioSrc} controls autoPlay>
          <source src={audioSrc} type="audio/mpeg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        isLoading && <p>Carregando...</p>
      )}
    </div>
  );
}

export default BotaoGetAudio;
