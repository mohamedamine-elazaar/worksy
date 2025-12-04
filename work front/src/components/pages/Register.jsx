import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserPlus, Mail, Lock, Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"
import { authApi } from "../context/utils/api"

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [role, setRole] = useState("freelancer") // freelancer | stagiaire | entreprise
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "", company: "" })
  const [error, setError] = useState("")

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!values.name || !values.email || !values.password || !values.confirm) {
      setError(t('register.error.missingFields'))
      return
    }
    if (values.password.length < 6) {
      setError(t('register.error.passwordLength'))
      return
    }
    if (values.password !== values.confirm) {
      setError(t('register.error.passwordMismatch'))
      return
    }

    const mappedRole = role === 'entreprise' ? 'entreprise' : 'user'
    const payload = {
      fullName: values.name,
      email: values.email,
      password: values.password,
      role: mappedRole,
      company: role === 'entreprise' ? values.company : undefined,
    }
    try {
      await authApi.register(payload)
      // After successful registration, go to login
      navigate('/login')
    } catch (err) {
      // Show backend message like "Email already exists" or generic error
      setError(err.message || t('register.error.generic'))
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-50 text-indigo-600"><UserPlus className="w-5 h-5" /></div>
          <h1 className="text-xl sm:text-2xl font-bold">{t('register.title')}</h1>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm">{t('register.accountType')}
              <select
                className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="freelancer">{t('register.role.freelancer')}</option>
                <option value="stagiaire">{t('register.role.intern')}</option>
                <option value="entreprise">{t('register.role.company')}</option>
              </select>
            </label>

            {role === 'entreprise' ? (
              <label className="text-sm">{t('register.companyName')}
                <input name="company" value={values.company} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
              </label>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>

          <label className="text-sm">{t('register.fullName')} *
            <div className="mt-1 flex items-center gap-2 border rounded-md px-3">
              <UserPlus className="w-4 h-4 text-gray-500" />
              <input name="name" value={values.name} onChange={onChange} className="w-full py-2 outline-none" required />
            </div>
          </label>

          <label className="text-sm">{t('register.email')} *
            <div className="mt-1 flex items-center gap-2 border rounded-md px-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <input type="email" name="email" value={values.email} onChange={onChange} className="w-full py-2 outline-none" required />
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm">{t('register.password')}
              <div className="mt-1 flex items-center gap-2 border rounded-md px-3">
                <Lock className="w-4 h-4 text-gray-500" />
                <input type="password" name="password" value={values.password} onChange={onChange} className="w-full py-2 outline-none" required />
              </div>
              <div className="text-xs text-gray-500 mt-1">{t('register.passwordHint')}</div>
            </label>
            <label className="text-sm">{t('register.confirmPassword')}
              <div className="mt-1 flex items-center gap-2 border rounded-md px-3">
                <Lock className="w-4 h-4 text-gray-500" />
                <input type="password" name="confirm" value={values.confirm} onChange={onChange} className="w-full py-2 outline-none" required />
              </div>
            </label>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            <Briefcase className="w-4 h-4" /> {t('register.submit')}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Déjà inscrit ? <a href="/login" className="text-indigo-600 hover:underline">Se connecter</a>
          </div>
        </form>
      </div>
    </main>
  )
}
