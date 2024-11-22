"use client";
import Carousel from "./components/Carousel";
import { useRouter } from "next/navigation";
import ModalFormsOnibus from "./components/ModalFormsOnibus";
import styles from "./page.module.css";
import Link from "next/link";
import { textos } from "./data";
import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (query.trim() === "") {
      setFilteredNews(news);
    } else {
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = news.filter((article) =>
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.description.toLowerCase().includes(normalizedQuery)
      );
      setFilteredNews(filtered);
    }
    setIsSearchActive(true);
  };

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }
        const data = await response.json();
        setNews(data.articles);
        setFilteredNews(data.articles); // Inicialmente, mostrar todas as notícias
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.containerlogoEnome}>
          <Link href={"/"}>
            <img
              className={styles.logoOnibus}
              src="/logo/onibus.svg"
              alt="Logo de um onibus com borda preta"
            />
          </Link>
          <h1 className={styles.h1}>Pega o bus AI</h1>
        </div>
      </header>
      <main className={styles.main}>
        {!isSearchActive && (
          <>
            <ModalFormsOnibus />
            <div className={styles.curiosidadesSection}>
              <h2>Curiosidades Sobre Ônibus</h2>
              <ul>
                <li>O primeiro ônibus a motor foi inventado em 1895 por Carl Benz, o mesmo inventor do automóvel.</li>
                <li>Os ônibus são responsáveis por transportar cerca de 50% dos passageiros de transporte público em grandes cidades ao redor do mundo.</li>
                <li>Os ônibus articulados, também conhecidos como "sanfona", podem ter até 25 metros de comprimento e transportar mais de 200 passageiros.</li>
                <li>No Brasil, o Dia do Motorista de Ônibus é comemorado em 25 de julho, celebrando esses importantes profissionais do transporte público.</li>
                <li>Ônibus elétricos são uma alternativa sustentável e têm sido cada vez mais utilizados em várias cidades para reduzir a poluição.</li>
                <li>Os ônibus de dois andares, famosos em Londres, começaram a circular em 1956 e se tornaram um ícone da cidade.</li>
              </ul>
            </div>
            <Carousel />
          </>
        )}
    
        {isSearchActive && (
          <div className={styles.newsSection}>
            <h2>Resultados da Pesquisa</h2>
            {filteredNews.length > 0 ? (
              filteredNews.map((article, index) => (
                <div key={index} className={styles.newsItem}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Leia mais
                  </a>
                </div>
              ))
            ) : (
              <p>Nenhuma notícia encontrada.</p>
            )}
          </div>
        )}
      </main>
      {!isSearchActive && (
        <footer className={styles.footer}>
          {textos.map((item, key) => (
            <div key={key} className={styles.itemDica}>
              <div className={styles.containerDica}>
                <p>{item.descricao}</p>
              </div>
            </div>
          ))}
        </footer>
      )}
    </div>
  );
}
