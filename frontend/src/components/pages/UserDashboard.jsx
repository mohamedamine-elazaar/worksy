import { useTranslation } from "react-i18next";

export default function UserDashboard() {
  const { t } = useTranslation();
  const stats = [
    { id: 1, title: t('user.stats.saved'), value: 8 },
    { id: 2, title: t('user.stats.applications'), value: 14 },
    { id: 3, title: t('user.stats.messages'), value: 3 },
  ];

  const recentApplications = [
    { id: 1, title: 'Frontend Developer at ACME', status: 'Interview' },
    { id: 2, title: 'UI Designer at Beta Co', status: 'Applied' },
    { id: 3, title: 'Intern at StartupX', status: 'Rejected' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('user.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow-sm">
            <div className="text-sm text-gray-500">{s.title}</div>
            <div className="text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">{t('user.recentApplications')}</h2>
        <ul className="space-y-2">
          {recentApplications.map((a) => (
            <li key={a.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-gray-500">{t('user.status')}: {a.status}</div>
              </div>
              <div>
                <button className="text-sm text-blue-600">{t('user.view')}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
