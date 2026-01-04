import { LayoutTemplate, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.webp';

interface NavbarProps {
  currentPage: 'editor' | 'settings';
  onPageChange: (page: 'editor' | 'settings') => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await signOut();
    }
  };

  return (
    <nav className="w-16 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 flex-shrink-0">
      {/* Logo en haut */}
      <div className="mb-4">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
      </div>
      
      <div className="flex-1 flex flex-col items-center gap-2">
        <button
          onClick={() => onPageChange('editor')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentPage === 'editor'
              ? 'bg-[#1E90FF] text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-[#1E90FF]'
          }`}
          title="Éditeur"
        >
          <LayoutTemplate size={24} />
        </button>
        
        <button
          onClick={() => onPageChange('settings')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            currentPage === 'settings'
              ? 'bg-[#1E90FF] text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50 hover:text-[#1E90FF]'
          }`}
          title="Réglages"
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Bouton de déconnexion */}
      <button
        onClick={handleSignOut}
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all text-gray-500 hover:bg-red-50 hover:text-red-600"
        title="Se déconnecter"
      >
        <LogOut size={20} />
      </button>
    </nav>
  );
}
