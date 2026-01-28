
import React from 'react';
import { Screen } from '../types';

interface NavBarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeScreen, onNavigate }) => {
  const items = [
    { screen: Screen.EXPLORE, icon: 'explore', label: 'Explore' },
    { screen: Screen.RADAR, icon: 'radar', label: 'Radar' },
    { screen: Screen.ZONE, icon: 'cell_tower', label: 'Zone' },
    { screen: Screen.PROFILE, icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
      <div className="glass-panel rounded-full h-16 flex items-center justify-between px-4 shadow-2xl backdrop-blur-3xl border border-white/10">
        {items.map((item) => {
          const isActive = activeScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive ? 'text-primary' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill-current scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_#e64233]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
