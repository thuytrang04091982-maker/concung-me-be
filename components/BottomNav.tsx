
import React from 'react';
import { Home, Gift, User, LucideIcon } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavItem: React.FC<{ 
  icon: LucideIcon, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
      active ? 'text-[#FF85A1]' : 'text-gray-400'
    }`}
  >
    <div className={`p-2 rounded-full transition-all ${active ? 'bg-[#FFF0F3]' : ''}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[10px] font-semibold ${active ? 'opacity-100' : 'opacity-70'}`}>
      {label}
    </span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 glass border-t border-gray-100 px-6 py-2 safe-bottom flex justify-between items-center z-50">
      <NavItem 
        icon={Home} 
        label="Trang chủ" 
        active={currentScreen === 'HOME'} 
        onClick={() => onNavigate('HOME')} 
      />
      <NavItem 
        icon={Gift} 
        label="Quà tặng" 
        active={currentScreen === 'GIFTS'} 
        onClick={() => onNavigate('GIFTS')} 
      />
      <NavItem 
        icon={User} 
        label="Cá nhân" 
        active={['PROFILE', 'BANKING', 'SECURITY'].includes(currentScreen)} 
        onClick={() => onNavigate('PROFILE')} 
      />
    </div>
  );
};

export default BottomNav;
