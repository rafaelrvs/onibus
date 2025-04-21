"use client";
import Carousel from "./components/Carousel";
import ModalFormsOnibus from "./components/ModalFormsOnibus";
import styles from "./page.module.css";
import Link from "next/link";
import { textos } from "./data"; // Importando os textos
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filteredTextos, setFilteredTextos] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
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
                {[
                  /* Suas curiosidades aqui */
                ].map((curiosity, index) => (
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
        
        <br />
        <br />
        <h2>Dicas</h2>
        {textos.map((item, key) => (
          <div key={key} className={styles.itemDica}>
            <div className={styles.containerDica}>
              <p>{item.descricao}</p>
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}
