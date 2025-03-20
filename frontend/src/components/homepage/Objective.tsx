import React from 'react';
import { useTranslation } from 'react-i18next';

const Objective: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
        {t('objective.title', 'Our Objective')}
      </h2>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <p className="text-lg text-gray-700 leading-relaxed">
          {t(
            'objective.description',
            'We aim to empower women in Rwanda by providing access to vital resources, educational opportunities, and a supportive community.\n\nOur goal is to foster growth, collaboration, and success among women in our city, creating pathways to economic independence and leadership.'
          )}
        </p>
      </div>
    </div>
  );
};

export default Objective;
