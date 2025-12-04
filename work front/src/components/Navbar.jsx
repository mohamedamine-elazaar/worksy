import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useAuth } from "./context/useAuth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { role, setRole, token, user, setToken, setUser } = useAuth();
  

  

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

  const showProfileLink = true;
  const showDashboardLink = true;
  const showOffersLink = true;

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