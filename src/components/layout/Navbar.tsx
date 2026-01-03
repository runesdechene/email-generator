import { LayoutTemplate, Settings } from 'lucide-react';

interface NavbarProps {
  currentPage: 'editor' | 'settings';
  onPageChange: (page: 'editor' | 'settings') => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  return (
    <nav className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-6 flex-shrink-0">
      <div className="flex-1 flex flex-col items-center gap-2">
        <button
          onClick={() => onPageChange('editor')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentPage === 'editor'
              ? 'bg-violet-600 text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Éditeur"
        >
          <LayoutTemplate size={24} />
        </button>
        
        <button
          onClick={() => onPageChange('settings')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentPage === 'settings'
              ? 'bg-violet-600 text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Réglages"
        >
          <Settings size={24} />
        </button>
      </div>
    </nav>
  );
}
