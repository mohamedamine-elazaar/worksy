




import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const stats = [
    { id: 1, title: t('admin.stats.users'), value: 1240 },
    { id: 2, title: t('admin.stats.offers'), value: 87 },
    { id: 3, title: t('admin.stats.reviews'), value: 5 },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice', role: 'user' },
    { id: 2, name: 'Bob', role: 'entreprise' },
    { id: 3, name: 'Charlie', role: 'user' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('admin.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow-sm">
            <div className="text-sm text-gray-500">{s.title}</div>
            <div className="text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">{t('admin.recentUsers')}</h2>
        <ul className="space-y-2">
          {recentUsers.map((u) => (
            <li key={u.id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-500">{u.role}</div>
              </div>
              <div>
                <button className="text-sm text-blue-600">{t('admin.view')}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
