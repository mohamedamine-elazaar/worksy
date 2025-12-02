import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole } = useAuth()

  // Very small, local role-determination rules for development/testing.
  // Assumptions:
  // - admin credentials: admin@work.com / adminpass
  // - entreprise users have emails ending with @entreprise.com or include 'entreprise'
  // - everything else is treated as a regular user
  const determineRole = (emailValue, pwd) => {
    const e = (emailValue || "").trim().toLowerCase();
    if (e === "admin@work.com" && pwd === "adminpass") return "admin";
    if (e.endsWith("@entreprise.com") || e.includes("entreprise")) return "entreprise";
    return "user";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t('login.error.missingFields'));
      return;
    }

    const role = determineRole(email, password);
    // persist role in auth context (if available) and redirect to principal dashboard
    try {
      setRole(role)
    } catch {
      try { localStorage.setItem('role', role) } catch { /* ignore */ }
    }
    // If user has not created a profile yet, send them to profile creation
    let hasProfile = false
    try {
      hasProfile = !!localStorage.getItem('profile')
    } catch { /* ignore */ }

    if (!hasProfile) navigate('/Profile?create=1')
    else navigate('/dashboard')
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{t('login.title')}</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('login.emailPlaceholder')}
          className="border p-2 rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('login.passwordPlaceholder')}
          className="border p-2 rounded"
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button type="submit" className="bg-blue-500 text-white py-2 rounded">{t('login.submit')}</button>
      </form>
    </div>
  );
}

