'use client';

import React from 'react';
import styles from "./Login.module.css";
import Link from 'next/link';
import { FaGoogle } from "react-icons/fa";

const Login = () => {
    function handleLogin(e) {
        e.preventDefault();
        alert("Em desenvolvimento");
    }

    const handleGoogleLogin = () => {
        alert("Login com Google");
    };

    return (
        <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.headerLogin}>
                <h1>Login</h1>
            <Link href={"/"}>
                <img className={styles.logo} src="/logo/logoPreto.svg" alt="logo ônibus" />
            </Link>
            </div>
            <label className={styles.label}>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    required
                />
            </label>
            <div className={styles.googleLogin}>
                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={handleGoogleLogin}
                >
                    <FaGoogle /> Login com Google
                </button>
            </div>
            <button
                className={styles.submitButton}
                type="submit"
            >
                Entrar
            </button>
            <Link href="/Register" className={styles.link}>
                Não tenho conta
            </Link>
        </form>
    );
};

export default Login;
