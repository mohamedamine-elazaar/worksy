import { useEffect, useMemo, useState } from "react"
import { User, Mail, Briefcase, MapPin, ShieldCheck, Edit3, Save, X, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/useAuth"

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

  useEffect(() => {
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
      }
    } catch {/* ignore */}
    setLoading(false)
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
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{form ? form.name : t('register.title')}</h1>
              {form ? (
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1"><Briefcase className="w-4 h-4" />{form.role}</span>
                  <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" />{form.email}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{form.location}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck className="w-4 h-4" />{t('profile.verified')}</span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Complétez votre profil pour commencer.</p>
              )}
            </div>
            {!editing ? (
              <button onClick={startEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                <Edit3 className="w-4 h-4" /> {form ? t('profile.edit') : t('register.submit')}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                  <Save className="w-4 h-4" /> {t('profile.save')}
                </button>
                <button onClick={cancelEdit} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                  <X className="w-4 h-4" /> {t('profile.cancel')}
                </button>
              </div>
            )}
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
                    <label className="text-xs text-gray-500">{t('profile.name')}</label>
                    <input
                      className="w-full mt-1 border rounded-md px-3 py-2"
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{t('profile.email')}</label>
                    <input
                      type="email"
                      className="w-full mt-1 border rounded-md px-3 py-2"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
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

        {/* Right: Ratings / Activity */}
        <div className="space-y-6">
          {form ? (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">Notes</h3>
              <div className="mt-3 flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5" />
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">Score basé sur les retours (placeholder)</div>
            </div>
          ) : null}

          {form ? (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">Activité récente</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• A postulé à "Frontend React Developer"</li>
                <li>• Profil mis à jour</li>
                <li>• Nouveau message d'une entreprise</li>
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
