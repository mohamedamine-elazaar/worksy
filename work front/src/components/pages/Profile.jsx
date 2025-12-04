import { useEffect, useMemo, useState } from "react"
import { User, Mail, Briefcase, MapPin, ShieldCheck, Edit3, Save, X, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { authApi } from "../context/utils/api"

export default function Profile() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const initialDraft = useMemo(() => ({
    name: "",
    role: "freelancer",
    email: "",
    location: "",
    bio: "",
    skills: ["React", "Tailwind", "Node"],
  }), [])

  const [draft, setDraft] = useState(initialDraft)

  // Helpers for a more polished UI
  const initials = (name = "") => name.trim().split(/\s+/).map(w => w[0]).slice(0,2).join('').toUpperCase() || 'U'
  const completeness = (p) => {
    if (!p) return 0
    const fields = [p.name, p.email, p.location, p.bio]
    const score = fields.reduce((acc, v) => acc + (v && String(v).trim().length ? 1 : 0), 0) + ((p.skills?.length || 0) > 0 ? 1 : 0)
    return Math.round((score / 5) * 100)
  }
  const percent = completeness(form)

  useEffect(() => {
    async function init() {
      try {
        const raw = localStorage.getItem('profile')
        if (raw) {
          setForm(JSON.parse(raw))
        } else if (user) {
          const fromAuth = {
            name: user.fullName || "",
            email: user.email || "",
            role: user.role || "freelancer",
            location: "",
            bio: "",
            skills: [],
          }
          setForm(fromAuth)
        } else {
          const accRaw = localStorage.getItem('account')
          if (accRaw) {
            const acc = JSON.parse(accRaw)
            const fromAcc = {
              name: acc.fullName || "",
              email: acc.email || "",
              role: acc.role || "freelancer",
              location: "",
              bio: "",
              skills: [],
            }
            setForm(fromAcc)
          }
          // Try backend /auth/me if token exists
          const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
          if (token) {
            const data = await authApi.me(token)
            const u = data?.user
            if (u) {
              const fromMe = {
                name: u.fullName || "",
                email: u.email || "",
                role: u.role || "freelancer",
                location: "",
                bio: "",
                skills: u.skills || [],
              }
              setForm(fromMe)
            }
          }
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    init()
  }, [])

  const startEdit = () => {
    setDraft(form || initialDraft)
    setEditing(true)
  }
  const cancelEdit = () => setEditing(false)
  const saveEdit = (e) => {
    e?.preventDefault()
    setForm(draft)
    try {
      localStorage.setItem('profile', JSON.stringify(draft))
    } catch {/* ignore */}
    // sync minimal fields back to auth user for Navbar toggle harmony
    try {
      const nextUser = { ...(user || {}), fullName: draft.name, email: draft.email }
      setUser(nextUser)
      localStorage.setItem('user', JSON.stringify(nextUser))
    } catch { /* ignore */ }
    setEditing(false)
  }

  // Auto-open editor when profile missing or query param create=1 is set
  useEffect(() => {
    if (loading) return
    const params = new URLSearchParams(location.search)
    const wantsCreate = params.get('create') === '1'
    if ((!form || wantsCreate) && !editing) {
      setDraft(form || initialDraft)
      setEditing(true)
    }
  }, [loading, form, editing, location.search, initialDraft])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Polished header with gradient and avatar */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xl">
                {form ? initials(form.name) : <User className="w-10 h-10" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{form ? form.name : t('register.title')}</h1>
                  {form && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium inline-flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {form.role}
                    </span>
                  )}
                </div>
                {form ? (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                    {form.email && (<span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" />{form.email}</span>)}
                    {form.location && (<span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{form.location}</span>)}
                    <span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck className="w-4 h-4" />{t('profile.verified')}</span>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">Complétez votre profil pour commencer.</p>
                )}
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <button onClick={startEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    <Edit3 className="w-4 h-4" /> {form ? t('profile.edit') : t('register.submit')}
                  </button>
                ) : (
                  <>
                    <button onClick={saveEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                      <Save className="w-4 h-4" /> {t('profile.save')}
                    </button>
                    <button onClick={cancelEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                      <X className="w-4 h-4" /> {t('profile.cancel')}
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Completeness bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Profile completeness</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: About & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold text-gray-900">{t('profile.about')}</h2>
            {!editing ? (
              <p className="mt-2 text-sm text-gray-700">{form?.bio || ""}</p>
            ) : (
              <form onSubmit={saveEdit} className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">{t('profile.name')} *</label>
                    <input
                      className="w-full mt-1 border rounded-md px-3 py-2"
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t('profile.email')} *</label>
                    <input
                      type="email"
                      className="w-full mt-1 border rounded-md px-3 py-2"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t('profile.location')}</label>
                    <input
                      className="w-full mt-1 border rounded-md px-3 py-2"
                      value={draft.location}
                      onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t('profile.role')}</label>
                    <select
                      className="w-full mt-1 border rounded-md px-3 py-2 bg-white"
                      value={draft.role}
                      onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="stagiaire">Stagiaire</option>
                      <option value="entreprise">Entreprise</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Bio</label>
                  <textarea
                    className="w-full mt-1 border rounded-md px-3 py-2"
                    rows={4}
                    value={draft.bio}
                    onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  />
                </div>
              </form>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold text-gray-900">Compétences</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(form?.skills || []).map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Contact / Activity */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {form?.email ? (
                  <a className="text-blue-600 hover:underline" href={`mailto:${form.email}`}>{form.email}</a>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{form?.location || <span className="text-gray-500">—</span>}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Activité récente</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Profil créé</li>
              <li>• Profil mis à jour</li>
              <li>• A postulé à une offre</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
