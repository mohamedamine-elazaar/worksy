import { useTranslation } from "react-i18next";

export default function EntrepriseDashboard() {
  const { t } = useTranslation();
  const company = {
    name: 'ACME Entreprise',
    postedJobs: 12,
    applicants: 234,
  };

  const jobs = [
    { id: 1, title: 'Frontend Developer', applicants: 42 },
    { id: 2, title: 'Product Manager', applicants: 18 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{company.name} {t('entreprise.dashboard')}</h1>

      <div className="flex gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">{t('entreprise.stats.posted')}</div>
          <div className="text-xl font-semibold">{company.postedJobs}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">{t('entreprise.stats.applicants')}</div>
          <div className="text-xl font-semibold">{company.applicants}</div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">{t('entreprise.jobs')}</h2>
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">{job.title}</div>
                <div className="text-sm text-gray-500">{job.applicants} applicants</div>
              </div>
              <div>
                <button className="text-sm text-blue-600">{t('entreprise.manage')}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
