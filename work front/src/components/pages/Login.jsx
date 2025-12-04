import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { authApi } from "../context/utils/api";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState(""); // "stagiaire" | "self_employed" | "freelancer" | "company"
  const [nationalId, setNationalId] = useState("");
  const [contractorCard, setContractorCard] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setRole, setToken, setUser } = useAuth()

  // Login via backend; no local role heuristics.

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t('login.error.missingFields'));
      return;
    }
    // Validation consistent with signup: require account type selection
    if (!accountType) {
      setError(t('register.error.missingFields'));
      return;
    }
    // Basic client-side validation for additional fields
    if (accountType === 'stagiaire' && !nationalId.trim()) {
      setError('National ID is required for interns');
      return;
    }
    if (accountType === 'self_employed') {
      if (!nationalId.trim()) {
        setError('National ID is required for self-employed');
        return;
      }
      if (!contractorCard.trim()) {
        setError('Self-employed contractor card number is required');
        return;
      }
    }
    try {
      const extra = {
        accountType: accountType || undefined,
        nationalId: nationalId || undefined,
        contractorCard: contractorCard || undefined,
      };
      const { token, user } = await authApi.login(email, password, extra);
      setToken(token);
      setUser(user);
      setRole(user?.role || null);

      const hasProfile = !!user?.profile || !!localStorage.getItem('profile');
      if (!hasProfile) navigate('/Profile?create=1');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || t('login.error.generic'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{t('login.title')}</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
        {/* Account type (required to align with signup) */}
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Select account type</option>
          <option value="stagiaire">Stagiaire / Intern</option>
          <option value="self_employed">Self-employed contractor</option>
          <option value="freelancer">Freelancer</option>
          <option value="company">Company</option>
        </select>

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

        {accountType === 'stagiaire' && (
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="National ID number"
            className="border p-2 rounded"
          />
        )}
        {accountType === 'self_employed' && (
          <>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="National ID number"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={contractorCard}
              onChange={(e) => setContractorCard(e.target.value)}
              placeholder="Self-employed contractor card number"
              className="border p-2 rounded"
            />
          </>
        )}

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button type="submit" className="bg-blue-500 text-white py-2 rounded">{t('login.submit')}</button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-blue-600 hover:text-blue-700 text-sm underline mt-1 text-left"
        >
          Forgot password?
        </button>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="text-gray-600 hover:text-gray-800 text-sm underline mt-1 text-left"
        >
          Create an account
        </button>
      </form>
    </div>
  );
}

