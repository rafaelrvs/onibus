import React from "react";
import styles from "./Policies.module.css";

const cookiespolicy = ({ page }) => {
  const content = {
    privacy: (
      <div>
        <h1>Política de Privacidade</h1>
        <p>
          Sua privacidade é importante para nós. Coletamos informações apenas
          para melhorar sua experiência no site. Informações pessoais, como nome
          e e-mail, são armazenadas de forma segura e não são compartilhadas com
          terceiros.
        </p>
      </div>
    ),
    terms: (
      <div>
        <h1>Termos de Uso</h1>
        <p>Ao acessar este site, você concorda com os seguintes termos:</p>
        <ul>
          <li>Não utilizar os serviços para fins ilegais.</li>
          <li>Respeitar os direitos de propriedade intelectual.</li>
        </ul>
      </div>
    ),
    about: (
      <div>
        <h1>Sobre Nós</h1>
        <p>Bem-vindo ao nosso site! Facilitamos seu acesso ao transporte público.</p>
      </div>
    ),
  };

  return (
    <div className={styles.policyContainer}>
      {content[page] || <p>Página não encontrada.</p>}
    </div>
  );
};

export default cookiespolicy;
