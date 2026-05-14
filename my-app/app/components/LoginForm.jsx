"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import { setAuthToken } from "@/lib/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setValidationError("");

    if (!email.trim() || !password.trim()) {
      setValidationError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      setAuthToken(data.token, data.user, data.investor_id || "INV001", rememberMe);
      router.push("/dashboard");
    } catch (fetchError) {
      setError("Unable to connect to the backend. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Investor Login</h2>
      

      <label className={styles.label} htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="example@gmail.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={styles.input}
        required
      />

      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={styles.input}
        required
      />

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className={styles.checkbox}
          />
          Remember me
        </label>
      </div>

      {validationError ? <div className={styles.error}>{validationError}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}