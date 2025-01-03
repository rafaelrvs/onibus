"use client";
import Carousel from "./components/Carousel";
import ModalFormsOnibus from "./components/ModalFormsOnibus";
import styles from "./page.module.css";
import Link from "next/link";
import { textos } from "./data"; // Importando os textos
import { useEffect, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filteredTextos, setFilteredTextos] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCookiesBanner, setShowCookiesBanner] = useState(true);

  const itemsPerPage = 5; // Número máximo de itens por página

  // Função de busca
  const handleSearch = () => {
    const normalizedQuery = query.trim().toLowerCase();

    // Filtrar pela descrição que contém o texto digitado
    const filtered = normalizedQuery
      ? textos.filter((item) =>
          item.descricao.toLowerCase().includes(normalizedQuery)
        )
      : textos;

    // Ordenar alfabeticamente pelo título
    const sortedFiltered = filtered.sort((a, b) =>
      a.titulo.localeCompare(b.titulo)
    );

    setFilteredTextos(sortedFiltered);
    setIsSearchActive(true);
    setCurrentPage(1); // Reinicia para a primeira página após a busca
  };

  // Função para aceitar cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted) {
      setShowCookiesBanner(false);
    }
  }, []);

  const handleCookiesAccept = () => {
    setShowCookiesBanner(false);
    localStorage.setItem("cookiesAccepted", "true");
  };

  // Paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredTextos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTextos.length / itemsPerPage);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.containerlogoEnome}>
          <Link href="/">
            <img
              className={styles.logoOnibus}
              src="/logo/onibus.svg"
              alt="Logo de um ônibus com borda preta"
            />
          </Link>
          <h1 className={styles.h1}>Pega o Bus AI</h1>
          
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.searchSection}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar palavras na descrição..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch}
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            Buscar
          </button>
        </div>

        {isSearchActive && (
          <div className={styles.resultsSection}>
            <h2>Resultados da Pesquisa</h2>
            {currentItems.length > 0 ? (
              <>
                {currentItems.map((item, index) => (
                  <div key={index} className={styles.resultItem}>
                    <h3>{item.titulo}</h3>
                    <p>{item.descricao}</p>
                  </div>
                ))}
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={styles.pageButton}
                      style={{
                        backgroundColor:
                          currentPage === i + 1 ? "#0056b3" : "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        margin: "0 5px",
                        padding: "5px 10px",
                      }}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>Nenhum resultado encontrado.</p>
            )}
          </div>
        )}

        {!isSearchActive && (
          <>
            <ModalFormsOnibus />
            <div className={styles.curiosidadesSection}>
              <h2>Curiosidades Sobre Ônibus</h2>
              <ul>
                {[ /* Suas curiosidades aqui */ ].map((curiosity, index) => (
                  <li key={index}>{curiosity}</li>
                ))}
              </ul>
            </div>
            <Carousel />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
      <iframe width="auto" height="365" src="https://www.youtube.com/embed/FUFxiPFcG58?si=keGPT0ob1cUqF5Lf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
   <br/>
   <br/>
    <h2>Dicas</h2>
        {textos.map((item, key) => (
          <div key={key} className={styles.itemDica}>
            <div className={styles.containerDica}>
              <p>{item.descricao}</p>
            </div>
          </div>
        ))}
        <div className={styles.privacyLinks}>
          <Link href="/cookiespolicy">Política de Privacidade</Link> |{" "}
          <Link href="/cookiespolicy">Política de Cookies</Link>
        </div>
      </footer>

      {/* Cookies Banner */}
      {showCookiesBanner && (
        <div className={styles.cookiesBannerFixed}>
          <p>
            🍪 Nós coletamos cookies para oferecer um serviço personalizado.
            Consulte nossa <Link href="/cookies-policy">Política de Cookies</Link>{" "}
            e{" "}
            <Link href="/privacy-policy">Política de Privacidade</Link>.
          </p>
          <div className={styles.cookiesActions}>
            <button
              onClick={handleCookiesAccept}
              className={styles.cookiesButton}
            >
              Entendi
            </button>
            <button className={styles.cookiesCustomizeButton}>Personalizar</button>
          </div>
          <button
            className={styles.cookiesCloseButton}
            onClick={() => setShowCookiesBanner(false)}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
}
