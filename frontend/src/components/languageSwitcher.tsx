import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        className={`px-3 py-1 rounded ${
          i18n.language === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-200'
        }`}
        onClick={() => changeLanguage('en')}>
        English
      </button>
      <button
        className={`px-3 py-1 rounded ${
          i18n.language === 'fr' ? 'bg-purple-600 text-white' : 'bg-gray-200'
        }`}
        onClick={() => changeLanguage('fr')}>
        Français
      </button>
      <button
        className={`px-3 py-1 rounded ${
          i18n.language === 'rw' ? 'bg-purple-600 text-white' : 'bg-gray-200'
        }`}
        onClick={() => changeLanguage('rw')}>
        Kinyarwanda
      </button>
    </div>
  );
};

export default LanguageSwitcher;
