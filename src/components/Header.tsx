import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Snowflake, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  let navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/about', label: t('nav.about') },
  ];
  if (user?.userType === 'farmer') {
    navItems = [
      { path: '/', label: t('nav.home') },
      { path: '/farmer', label: t('nav.farmers') },
      { path: '/pricing', label: t('nav.pricing') },
      { path: '/about', label: t('nav.about') },
    ];
  } else if (user?.userType === 'chiller-owner') {
    navItems = [
      { path: '/', label: t('nav.home') },
      { path: '/chiller-owner', label: t('nav.chillerOwners') },
      { path: '/pricing', label: t('nav.pricing') },
      { path: '/about', label: t('nav.about') },
    ];
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: 'en' | 'hi') => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Snowflake className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">CoolKisan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="font-medium">{currentLanguage?.nativeName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as 'en' | 'hi')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{lang.nativeName}</span>
                          {language === lang.code && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700">{user.email}</div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Language Switcher */}
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Language / भाषा</div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code as 'en' | 'hi');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      language === lang.code 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>
            {user ? (
              <div className="block px-3 py-2 rounded-md text-base font-medium bg-blue-50 text-blue-700">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="mt-2 w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;