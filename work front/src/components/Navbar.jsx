import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Settings, User as UserIcon } from "lucide-react";
import { useAuth } from "./context/useAuth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { role, setRole, token, user, setToken, setUser } = useAuth();
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [prefs, setPrefs] = useState({ showProfile: true, showDashboard: true, showOffers: true });
  const [userDraft, setUserDraft] = useState({ fullName: "", email: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ui_prefs');
      if (raw) {
        const parsed = JSON.parse(raw);
        setPrefs((p) => ({ ...p, ...parsed?.nav }));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    setUserDraft({ fullName: user?.fullName || "", email: user?.email || "" });
  }, [user]);

  const savePrefs = (next) => {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    try {
      const raw = localStorage.getItem('ui_prefs');
      const base = raw ? JSON.parse(raw) : {};
      base.nav = merged;
      localStorage.setItem('ui_prefs', JSON.stringify(base));
    } catch { /* ignore */ }
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    // Adjust direction for Arabic
    document.body.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    try { setRole(null) } catch { /* ignore */ }
    try { setToken(null) } catch { /* ignore */ }
    try { setUser(null) } catch { /* ignore */ }
    try { localStorage.removeItem('role'); localStorage.removeItem('token'); localStorage.removeItem('user'); } catch { /* ignore */ }
    navigate('/login');
  };

  const isAuthed = !!(token || role || (typeof localStorage !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('role'))));
  const hasProfile = !!(user?.profile || (typeof localStorage !== 'undefined' && localStorage.getItem('profile')));

  const showProfileLink = prefs.showProfile !== false;
  const showDashboardLink = prefs.showDashboard !== false;
  const showOffersLink = prefs.showOffers !== false;

  return (
    <nav className="bg-white shadow-lg">
  
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo et marque */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                className="h-20 w-auto z-index-1000" 
                src="/logo1.png" 
                alt="Worksy logo" 
                loading="eager"
              />
              
            </Link>
          </div>


          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              {t('navbar.home')}
            </Link>
            {showProfileLink && (
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('navbar.profile')}
              </Link>
            )}
            {showDashboardLink && (
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('navbar.dashboard')}
              </Link>
            )}
            {showOffersLink && (
              <Link 
                to="/offers" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('navbar.offers')}
              </Link>
            )}
            {(!isAuthed && !hasProfile) && (
              <Link 
                to="/signup" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('register.title')}
              </Link>
            )}
            {role || (typeof localStorage !== 'undefined' && localStorage.getItem('role')) ? (
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                {t('navbar.login')}
              </Link>
            )}

            {/* Sections Config Toggle */}
            <div className="relative">
              <button
                onClick={() => { setSectionsOpen((v) => !v); setUserOpen(false); }}
                className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                title="Configure sections"
              >
                <Settings className="w-4 h-4 text-gray-600" /> Sections
              </button>
              {sectionsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow p-3 z-50">
                  <label className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" checked={showProfileLink} onChange={(e) => savePrefs({ showProfile: e.target.checked })} />
                    <span>Profile link</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" checked={showDashboardLink} onChange={(e) => savePrefs({ showDashboard: e.target.checked })} />
                    <span>Dashboard link</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" checked={showOffersLink} onChange={(e) => savePrefs({ showOffers: e.target.checked })} />
                    <span>Offers link</span>
                  </label>
                </div>
              )}
            </div>

            {/* User Info Config Toggle */}
            <div className="relative">
              <button
                onClick={() => { setUserOpen((v) => !v); setSectionsOpen(false); }}
                className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                title="Configure user info"
              >
                <UserIcon className="w-4 h-4 text-gray-600" /> User Info
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow p-3 z-50">
                  <div className="text-xs text-gray-500 mb-2">Quick update (local)</div>
                  <input
                    className="w-full border rounded-md px-2 py-1 text-sm mb-2"
                    placeholder="Full name"
                    value={userDraft.fullName}
                    onChange={(e) => setUserDraft((d) => ({ ...d, fullName: e.target.value }))}
                  />
                  <input
                    type="email"
                    className="w-full border rounded-md px-2 py-1 text-sm mb-2"
                    placeholder="Email"
                    value={userDraft.email}
                    onChange={(e) => setUserDraft((d) => ({ ...d, email: e.target.value }))}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1 text-sm rounded-md bg-gray-100"
                      onClick={() => setUserOpen(false)}
                      type="button"
                    >Cancel</button>
                    <button
                      className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white"
                      onClick={() => {
                        const nextUser = { ...(user || {}), fullName: userDraft.fullName, email: userDraft.email };
                        try { setUser(nextUser) } catch { /* ignore */ }
                        try { localStorage.setItem('user', JSON.stringify(nextUser)) } catch { /* ignore */ }
                        setUserOpen(false);
                      }}
                      type="button"
                    >Save</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 border rounded-md px-2 py-1">
              <Globe className="w-4 h-4 text-gray-500" />
              <select 
                onChange={changeLanguage} 
                value={i18n.language} 
                className="bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
            </div>
          </div>

          {/* Bouton Hamburger pour mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('navbar.home')}
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {t('navbar.profile')}
              </Link>
              {showDashboardLink && (
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navbar.dashboard')}
                </Link>
              )}
              {showOffersLink && (
                <Link 
                  to="/offers" 
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navbar.offers')}
                </Link>
              )}
              {(!isAuthed && !hasProfile) && (
                <Link 
                  to="/signup" 
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {t('register.title')}
                </Link>
              )}
              {role || (typeof localStorage !== 'undefined' && localStorage.getItem('role')) ? (
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 block px-3 py-2 rounded-md text-base font-medium transition duration-300 text-center"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navbar.login')}
                </Link>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <select 
                    onChange={changeLanguage} 
                    value={i18n.language} 
                    className="bg-transparent text-base outline-none"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  
    </nav>
  );
}

export default Navbar;