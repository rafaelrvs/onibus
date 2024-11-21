'use client';

import React from 'react';
import styles from "./Register.module.css";
import Link from 'next/link';
import { FaGoogle } from "react-icons/fa";

const Register = () => {

    function handleClick(e){
        e.preventDefault()
        alert("em desenvolvimento")
    }
    const handleGoogleLogin = () => {
        alert('Login com Google');
    };

    return (
        <form className={styles.form} onClick={handleClick}>
            <div className={styles.headerCadastro}>
                <h1>Cadastre-se</h1>
                <Link href={"/"}>
                <img className={styles.logo} src="/logo/logoPreto.svg" alt="logo onibus" />
                </Link>
            </div>
            <label className={styles.label}>
                <input className={styles.input} type="email" placeholder="Email" required />
                <input className={styles.input} type="text" placeholder="Nome" required />
                <input className={styles.input} type="password" placeholder="Senha" required />
                <input className={styles.input} type="password" placeholder="Confirme sua senha" required />
                <input className={styles.submitButton} type="button" value="Cadastrar" />
                <div className={styles.googleLogin}>
                    <button type="button" className={styles.googleButton} onClick={handleGoogleLogin}>
                        <FaGoogle /> Login com Google
                    </button>
                </div>
                <Link className={styles.link} href={"/Login"}>Já tenho conta</Link>
            </label>
        </form>
    );
}

export default Register;
