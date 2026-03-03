
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex nm-inset p-1 rounded-2xl h-10 items-center">
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-nm ${
          current === 'en' ? 'nm-flat text-[#EA580C]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange('hi')}
        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-nm ${
          current === 'hi' ? 'nm-flat text-[#EA580C]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
        }`}
      >
        हि
      </button>
      <button
        onClick={() => onChange('ta')}
        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-nm ${
          current === 'ta' ? 'nm-flat text-[#EA580C]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageSelector;
