import { useMemo, useEffect, useState } from "react"
import { Search, Filter, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { apiRequest } from "../context/utils/api"

// Fetch offers from backend
function useOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError("")
    apiRequest("/offers")
      .then((data) => {
        if (!mounted) return
        // Normalize backend fields to UI expectations
        const normalized = (Array.isArray(data) ? data : []).map((o) => ({
          id: o._id,
          title: o.title,
          company: o.entrepriseId?.fullName || "",
          location: o.location || "",
          // Map backend type to display label
          type: o.type === "stage" ? "Stage" : o.type === "freelance" ? "Freelance" : o.type === "emploi" ? "Emploi" : "",
          // No category in backend; derive a simple category by title keywords
          category: /design/i.test(o.title) ? "design" : /data/i.test(o.title) ? "data" : /video/i.test(o.title) ? "video" : /marketing/i.test(o.title) ? "marketing" : /assistant|virtual/i.test(o.title) ? "virtual" : "web",
          posted: o.createdAt ? new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(Math.round((Date.now() - new Date(o.createdAt).getTime()) / (1000*60*60*24)) * -1, 'day') : "",
        }))
        setOffers(normalized)
      })
      .catch((err) => setError(err.message || "Failed to load offers"))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return { offers, loading, error }
}

function OfferCard({ offer }) {
  const { t } = useTranslation();
  return (
    <div className="p-5 bg-white rounded-lg border shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Briefcase className="w-4 h-4" />
          <span className="font-medium text-gray-700">{offer.company}</span>
        </div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{offer.title}</div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{offer.location}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{offer.posted}</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-medium">{offer.type}</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">{t(`home.categories.items.${offer.category}`)}</span>
        </div>
      </div>
      <button className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
        {t('offers.viewOffer')} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Offers() {
  const { t } = useTranslation();
  const { offers, loading, error } = useOffers()
  const [q, setQ] = useState("")
  const [cat, setCat] = useState("")
  const [type, setType] = useState("")

  const categories = [
    "web",
    "design",
    "marketing",
    "virtual",
    "video",
    "data",
  ]

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const matchQ = q ? (o.title + " " + o.company).toLowerCase().includes(q.toLowerCase()) : true
      const matchCat = cat ? o.category === cat : true
      const matchType = type ? o.type === type : true
      return matchQ && matchCat && matchType
    })
  }, [q, cat, type, offers])

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-md px-3">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('offers.searchPlaceholder')}
              className="w-full bg-transparent py-2 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="text-sm outline-none bg-transparent">
                <option value="">{t('offers.allCategories')}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{t(`home.categories.items.${c}`)}</option>
                ))}
              </select>
            </div>

            <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm border rounded-md px-3 py-2 bg-white">
              <option value="">{t('offers.type')}</option>
              <option value="Freelance">{t('offers.types.freelance')}</option>
              <option value="Stage">{t('offers.types.internship')}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
        <div className="grid grid-cols-1 gap-4">
          {loading && (
            <div className="text-center text-gray-500 bg-white border rounded-lg p-8">{t('offers.loading')}</div>
          )}
          {error && (
            <div className="text-center text-red-600 bg-white border rounded-lg p-8">{error}</div>
          )}
          {filtered.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 bg-white border rounded-lg p-8">{t('offers.noOffers')}</div>
          )}
        </div>
      </section>
    </main>
  )
}
