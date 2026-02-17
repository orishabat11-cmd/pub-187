"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
await signInWithEmailAndPassword(auth, email, password);
window.location.href = "/bartender";

    } catch {
      setError("פרטי התחברות שגויים");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>התחברות לברמן</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          התחבר
        </button>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
}
