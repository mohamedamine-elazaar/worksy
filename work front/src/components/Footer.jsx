import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">{t('footer.rights')}</div>
        <div className="flex gap-4 text-sm">
          <Link className="hover:underline" to="/terms">{t('footer.terms')}</Link>
          <Link className="hover:underline" to="/privacy">{t('footer.privacy')}</Link>
          <Link className="hover:underline" to="/contact">{t('footer.contact')}</Link>
        </div>
      </div>
    </footer>
  );
}
