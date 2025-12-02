import { useMemo, useState } from "react"
import { Search, Filter, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

const seedOffers = [
  { id: 1, title: "Frontend React Developer", company: "ACME", location: "Casablanca", type: "Freelance", category: "web", posted: "Il y a 2j" },
  { id: 2, title: "UI/UX Designer", company: "Studio Beta", location: "Rabat", type: "Stage", category: "design", posted: "Il y a 1j" },
  { id: 3, title: "Assistant virtuel FR/AR", company: "StartUp X", location: "Remote", type: "Freelance", category: "virtual", posted: "Aujourd'hui" },
  { id: 4, title: "Video Editor", company: "MediaPro", location: "Marrakech", type: "Freelance", category: "video", posted: "Il y a 5j" },
  { id: 5, title: "Data Analyst Jr.", company: "Insight", location: "Casablanca", type: "Stage", category: "data", posted: "Il y a 3j" },
]

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
    return seedOffers.filter((o) => {
      const matchQ = q ? (o.title + " " + o.company).toLowerCase().includes(q.toLowerCase()) : true
      const matchCat = cat ? o.category === cat : true
      const matchType = type ? o.type === type : true
      return matchQ && matchCat && matchType
    })
  }, [q, cat, type])

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
