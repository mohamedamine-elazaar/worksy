import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/useAuth"
import {
  Search,
  Briefcase,
  Users,
  Zap,
  ShieldCheck,
  FilePlus,
  Calendar,
  PenTool,
  Monitor,
  Video,
  Database,
  Star,
  MessageSquare,
} from "lucide-react"

function Hero() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const resolvedRole = role || (typeof localStorage !== 'undefined' ? localStorage.getItem('role') : null);
  const isCompany = resolvedRole === 'entreprise';
  return (
    <section className="relative overflow-hidden bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="mt-4 text-indigo-100 max-w-xl">
              {t('home.hero.subtitle')}
            </p>

            <div className="mt-8">
              <div className="flex items-center gap-2 bg-white/95 text-gray-800 rounded-lg shadow-sm p-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <input
                  className="flex-1 bg-transparent px-2 py-2 placeholder:text-gray-500 focus:outline-none"
                  placeholder={t('home.hero.searchPlaceholder')}
                />
                <Link to="/offers" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  {t('home.hero.searchJob')}
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/offers"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white/95 text-indigo-700 px-5 py-3 font-semibold shadow hover:scale-[1.01] transition"
                aria-label={t('home.hero.searchJob')}
              >
                <Briefcase className="w-4 h-4" />
                {t('home.hero.searchJob')}
              </Link>

              {isCompany && (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 text-white px-5 py-3 font-semibold hover:bg-white/10 transition"
                  aria-label={t('home.hero.searchTalent')}
                >
                  <Users className="w-4 h-4" />
                  {t('home.hero.searchTalent')}
                </Link>
              )}
            </div>

            <div className="mt-8 text-sm text-indigo-100/90 max-w-lg">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t('home.hero.localPlatform')}
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <div
              className="w-full rounded-2xl p-6 bg-white/10 backdrop-blur-sm border border-white/20"
              aria-hidden
            >
              <div className="h-56 sm:h-64 lg:h-72 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-white/90" />
                </div>
              </div>

              <div className="mt-4 text-sm text-indigo-50/80">
                {t('home.hero.joinCommunity')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-24 -top-24 opacity-20">
        <div className="w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, title, description }) {
  return (
    <div className="p-4 bg-white/95 rounded-lg shadow-sm flex gap-4 items-start">
      <div className="bg-indigo-50 text-indigo-600 rounded-lg p-2">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, children }) {
  return (
    <div className="p-5 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-600">{children}</p>
    </div>
  )
}

function TrustLogos() {
  const logos = ['Atlas', 'ZenTech', 'GigaSoft', 'Nova', 'Pulse'];
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-80">
          {logos.map((l) => (
            <div key={l} className="text-sm font-semibold text-gray-500 tracking-wide">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">{t('home.problem.title')}</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            {t('home.problem.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={Zap}
            title={t('home.problem.stats.unemployment.title')}
            description={t('home.problem.stats.unemployment.desc')}
          />
          <StatCard
            icon={Monitor}
            title={t('home.problem.stats.experience.title')}
            description={t('home.problem.stats.experience.desc')}
          />
          <StatCard
            icon={Briefcase}
            title={t('home.problem.stats.access.title')}
            description={t('home.problem.stats.access.desc')}
          />
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">{t('home.solution.title')}</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            {t('home.solution.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={Zap} title={t('home.solution.features.matching.title')}>
            {t('home.solution.features.matching.desc')}
          </FeatureCard>

          <FeatureCard icon={ShieldCheck} title={t('home.solution.features.verified.title')}>
            {t('home.solution.features.verified.desc')}
          </FeatureCard>

          <FeatureCard icon={FilePlus} title={t('home.solution.features.booking.title')}>
            {t('home.solution.features.booking.desc')}
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      title: t('home.howItWorks.steps.create.title'),
      desc: t('home.howItWorks.steps.create.desc'),
      icon: Users,
    },
    {
      title: t('home.howItWorks.steps.find.title'),
      desc: t('home.howItWorks.steps.find.desc'),
      icon: Search,
    },
    {
      title: t('home.howItWorks.steps.collaborate.title'),
      desc: t('home.howItWorks.steps.collaborate.desc'),
      icon: Calendar,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t('home.howItWorks.title')}</h2>
          <p className="mt-2 text-gray-600">{t('home.howItWorks.subtitle')}</p>
        </div>

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg border shadow-sm flex gap-4">
              <div className="p-3 rounded bg-indigo-50 text-indigo-600">
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-gray-600 mt-1">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const { t } = useTranslation();
  const cats = [
    { name: t('home.categories.items.web'), icon: PenTool },
    { name: t('home.categories.items.design'), icon: Monitor },
    { name: t('home.categories.items.marketing'), icon: MessageSquare },
    { name: t('home.categories.items.virtual'), icon: Users },
    { name: t('home.categories.items.video'), icon: Video },
    { name: t('home.categories.items.data'), icon: Database },
  ]

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t('home.categories.title')}</h2>
          <p className="mt-2 text-gray-600">{t('home.categories.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {cats.map((c) => (
            <Link
              to={`/offers?category=${encodeURIComponent(c.name)}`}
              key={c.name}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border hover:shadow-sm transition"
            >
              <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium text-center">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonial({ name, quote, role }) {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <div className="text-gray-700 italic">“{quote}”</div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
        <div className="text-yellow-400">
          <Star className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  const { t } = useTranslation();
  const items = [
    {
      name: "Sara",
      role: t('home.testimonials.items.sara.role'),
      quote: t('home.testimonials.items.sara.quote'),
    },
    {
      name: "Youssef",
      role: t('home.testimonials.items.youssef.role'),
      quote: t('home.testimonials.items.youssef.quote'),
    },
    {
      name: "Amina",
      role: t('home.testimonials.items.amina.role'),
      quote: t('home.testimonials.items.amina.quote'),
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t('home.testimonials.title')}</h2>
          <p className="mt-2 text-gray-600">{t('home.testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <Testimonial key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedJobs() {
  const items = [
    { title: 'Frontend React Developer', company: 'Nova Labs', location: 'Remote', link: '/offers' },
    { title: 'UI/UX Designer', company: 'ZenTech', location: 'Casablanca', link: '/offers' },
    { title: 'Data Analyst', company: 'Atlas', location: 'Rabat', link: '/offers' },
  ]
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured jobs</h2>
          <Link to="/offers" className="text-indigo-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((j) => (
            <Link key={j.title} to={j.link} className="p-5 bg-white rounded-lg border hover:shadow-sm transition">
              <div className="flex items-center gap-2 text-indigo-600">
                <Briefcase className="w-5 h-5" />
                <div className="font-semibold">{j.title}</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">{j.company} • {j.location}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-indigo-600 text-white rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold">Ready to get started?</div>
            <div className="text-indigo-100">Create your profile or browse offers.</div>
          </div>
          <div className="flex gap-3">
            <Link to="/signup" className="px-4 py-2 bg-white text-indigo-700 rounded-md font-semibold">Create account</Link>
            <Link to="/offers" className="px-4 py-2 border border-white/50 rounded-md font-semibold">Browse offers</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { token } = useAuth();
  const hasAccount = !!token;
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Hero />
      <TrustLogos />
      <ProblemSection />
      <SolutionSection />
      <FeaturedJobs />
      <HowItWorks />
      <Categories />
      <Testimonials />
      {!hasAccount && <FinalCTA />}
    </main>
  )
}
