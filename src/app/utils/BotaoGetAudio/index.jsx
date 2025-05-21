"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { urlTSS } from "../urls";

export default function BotaoGetAudio({ text }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // 1) Memoizamos gerarAudio pra tê-lo estável nas deps
  const gerarAudio = useCallback(async (txt) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${urlTSS}/synthesize`,
        { text: txt.substring(0, 1000) },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(data);
      setAudioSrc(url);
    } catch (e) {
      console.error("Erro ao gerar áudio:", e);
      setError("Não foi possível gerar o áudio.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2) Efeito dispara sempre que text mudar
  useEffect(() => {
    if (text?.trim()) {
      gerarAudio(text);
    }
  }, [text, gerarAudio]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch((e) => console.error("Play impedido:", e));
  };

  return (
    <div>
      {isLoading && <p>Carregando áudio…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {audioSrc && (
        <div>
          <audio ref={audioRef} controls src={audioSrc}>
            Seu navegador não suporta áudio.
          </audio>
          <button
            onClick={handlePlay}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            ▶️ Tocar Áudio
          </button>
        </div>
      )}
    </div>
  );
}
