
import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { User, UserRole } from '../types';

type Category = 'ALL' | 'STUDENTS' | 'TOURISTS' | 'LANDMARKS';

interface MarkerData {
  id: string;
  type: Category;
  name: string;
  avatar?: string;
  icon?: string;
  description: string;
  distance: string;
  top: string;
  left: string;
  fullUser?: User; // Reference to full user object for navigation
}

const RADAR_MARKERS: MarkerData[] = [
  {
    id: 'li-wei',
    type: 'STUDENTS',
    name: 'Li Wei',
    avatar: IMAGES.LI_WEI_PORTRAIT,
    description: 'History • Tsinghua Univ.',
    distance: '500m away',
    top: '40%',
    left: '65%',
    fullUser: {
      id: 'li-wei',
      name: 'Li Wei',
      bio: 'Peking University History student. Specialist in Forbidden City history.',
      role: UserRole.STUDENT,
      avatar: IMAGES.LI_WEI_PORTRAIT,
      tags: ['History', 'Palace'],
      reputation: 4.9,
      balance: 120
    }
  },
  {
    id: 'alex',
    type: 'STUDENTS',
    name: 'Alex Chen',
    avatar: IMAGES.ALEX_PORTRAIT,
    description: 'Art & Design • CAFA',
    distance: '1.2km away',
    top: '25%',
    left: '40%',
    fullUser: {
      id: 'alex',
      name: 'Alex Chen',
      bio: 'Digital artist in Beijing.',
      role: UserRole.STUDENT,
      avatar: IMAGES.ALEX_PORTRAIT,
      tags: ['Art', 'Design'],
      reputation: 4.8,
      balance: 50
    }
  },
  {
    id: 'mike',
    type: 'TOURISTS',
    name: 'Mike C.',
    avatar: IMAGES.MIKE_AVATAR,
    icon: 'photo_camera',
    description: 'Photography Enthusiast',
    distance: '300m away',
    top: '30%',
    left: '20%',
    fullUser: {
      id: 'mike',
      name: 'Mike C.',
      bio: 'Traveler from UK.',
      role: UserRole.TOURIST,
      avatar: IMAGES.MIKE_AVATAR,
      tags: ['Photography'],
      reputation: 4.5,
      balance: 200
    }
  },
  {
    id: 'sarah',
    type: 'TOURISTS',
    name: 'Sarah J.',
    avatar: IMAGES.SARAH_AVATAR,
    icon: 'restaurant',
    description: 'Foodie Explorer',
    distance: '850m away',
    top: '60%',
    left: '35%',
    fullUser: {
      id: 'sarah',
      name: 'Sarah J.',
      bio: 'Always looking for the best Dumplings.',
      role: UserRole.TOURIST,
      avatar: IMAGES.SARAH_AVATAR,
      tags: ['Food'],
      reputation: 4.7,
      balance: 150
    }
  },
  {
    id: 'forbidden-city',
    type: 'LANDMARKS',
    name: 'Forbidden City',
    icon: 'temple_buddhist',
    description: 'Imperial Palace Museum',
    distance: '2.4km away',
    top: '45%',
    left: '50%',
  },
  {
    id: 'great-wall',
    type: 'LANDMARKS',
    name: 'Great Wall',
    icon: 'fort',
    description: 'Mutianyu Section',
    distance: '65km away',
    top: '15%',
    left: '80%',
  }
];

interface RadarProps {
  onViewProfile: (user: User) => void;
  onChat: (user: User) => void;
}

const Radar: React.FC<RadarProps> = ({ onViewProfile, onChat }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const filteredMarkers = activeCategory === 'ALL' 
    ? RADAR_MARKERS 
    : RADAR_MARKERS.filter(m => m.type === activeCategory);

  const handleMarkerClick = (id: string) => {
    setSelectedMarkerId(selectedMarkerId === id ? null : id);
  };

  const handleCategoryToggle = (category: Category) => {
    setActiveCategory(activeCategory === category ? 'ALL' : category);
    setSelectedMarkerId(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      {/* Map Layer */}
      <div className="absolute inset-0 z-0" onClick={() => setSelectedMarkerId(null)}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity grayscale contrast-125 transition-all duration-700"
          style={{ backgroundImage: `url("${IMAGES.AERIAL_MAP}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark/90"></div>
        
        {/* User Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <div className="relative w-6 h-6 bg-accent-blue rounded-full shadow-neon-blue border-2 border-white user-pulse"></div>
          <div className="mt-10 px-3 py-1 glass-panel rounded-full text-[9px] font-bold tracking-[0.2em] text-accent-blue uppercase border border-accent-blue/20 backdrop-blur-md">YOU</div>
        </div>

        {/* Dynamic Markers */}
        {filteredMarkers.map((marker) => (
          <div 
            key={marker.id}
            className="absolute transition-all duration-500 animate-in fade-in zoom-in-50"
            style={{ top: marker.top, left: marker.left }}
          >
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); handleMarkerClick(marker.id); }}
                className={`
                  w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300
                  ${selectedMarkerId === marker.id ? 'scale-125 z-50 ring-4 ring-white/20' : 'scale-100 z-10 hover:scale-110'}
                  ${marker.type === 'STUDENTS' ? 'bg-accent-green/20 border-2 border-accent-green shadow-neon-green' : ''}
                  ${marker.type === 'TOURISTS' ? 'bg-accent-orange/20 border-2 border-accent-orange shadow-glow' : ''}
                  ${marker.type === 'LANDMARKS' ? 'bg-accent-blue/20 border-2 border-accent-blue shadow-neon-blue' : ''}
                `}
              >
                {marker.avatar ? (
                  <img src={marker.avatar} alt={marker.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className={`material-symbols-outlined text-[24px] ${
                    marker.type === 'STUDENTS' ? 'text-accent-green' : 
                    marker.type === 'TOURISTS' ? 'text-accent-orange' : 'text-accent-blue'
                  }`}>
                    {marker.icon || 'location_on'}
                  </span>
                )}
              </button>

              {/* Popover */}
              {selectedMarkerId === marker.id && (
                <div 
                  className="absolute bottom-full mb-6 -left-1/2 -translate-x-1/4 w-[260px] glass-panel rounded-[2.2rem] p-5 border border-white/20 shadow-2xl animate-float z-[100]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      {marker.avatar ? (
                        <img src={marker.avatar} alt={marker.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white/20">{marker.icon}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-white text-base font-bold truncate">{marker.name}</h3>
                      <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest truncate">{marker.description}</p>
                      <div className="flex items-center gap-1 mt-1 font-bold text-[10px] text-accent-blue">
                        <span className="material-symbols-outlined text-[12px]">near_me</span> {marker.distance}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex gap-2">
                    <button 
                      onClick={() => marker.fullUser && onViewProfile(marker.fullUser)}
                      className="flex-1 h-11 rounded-full bg-primary hover:bg-red-600 transition-all text-[10px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 group"
                    >
                      {marker.type === 'LANDMARKS' ? 'Get Directions' : 'View Profile'}
                      <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    {marker.type !== 'LANDMARKS' && (
                      <button 
                        onClick={() => marker.fullUser && onChat(marker.fullUser)}
                        className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                      >
                        <span className="material-symbols-outlined">chat</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 h-full flex flex-col px-4 pt-16 pb-32 pointer-events-none">
        <div className="max-w-md mx-auto w-full pointer-events-auto">
          {/* Search Bar */}
          <div className="input-light rounded-full p-1.5 flex items-center gap-2 shadow-xl border-none mb-6 backdrop-blur-2xl">
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              type="text" 
              placeholder="Explore Sanlitun..."
              className="bg-transparent border-none focus:ring-0 text-black placeholder:text-black/40 text-sm flex-1 font-medium"
            />
            <button className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:text-black transition-colors">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
            <button 
              onClick={() => handleCategoryToggle('STUDENTS')}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shadow-lg border ${
                activeCategory === 'STUDENTS' 
                  ? 'bg-accent-green text-black border-transparent shadow-neon-green' 
                  : 'glass-panel text-white/60 border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">school</span> Students
            </button>
            <button 
              onClick={() => handleCategoryToggle('TOURISTS')}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shadow-lg border ${
                activeCategory === 'TOURISTS' 
                  ? 'bg-accent-orange text-black border-transparent shadow-glow' 
                  : 'glass-panel text-white/60 border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span> Tourists
            </button>
            <button 
              onClick={() => handleCategoryToggle('LANDMARKS')}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shadow-lg border ${
                activeCategory === 'LANDMARKS' 
                  ? 'bg-accent-blue text-black border-transparent shadow-neon-blue' 
                  : 'glass-panel text-white/60 border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">temple_buddhist</span> Landmarks
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Availability Toggle */}
        <div className="max-w-md mx-auto w-full flex justify-center mb-6 pointer-events-auto">
          <div className="glass-panel rounded-full py-2.5 pl-6 pr-3 flex items-center gap-8 shadow-2xl border border-white/10 backdrop-blur-2xl">
            <div className="flex flex-col">
              <span className="text-white text-[10px] font-bold tracking-widest uppercase">Radar Active</span>
              <span className={`text-[9px] font-bold uppercase transition-colors ${isAvailable ? 'text-accent-blue' : 'text-white/20'}`}>
                {isAvailable ? 'Visible to peers' : 'Stealth Mode'}
              </span>
            </div>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-14 h-8 rounded-full p-1 transition-all duration-300 flex items-center ${isAvailable ? 'bg-accent-blue/30' : 'bg-white/10'}`}
            >
              <div className={`w-6 h-6 rounded-full shadow-lg transition-transform duration-300 ${isAvailable ? 'translate-x-6 bg-accent-blue' : 'translate-x-0 bg-white/40'}`}></div>
            </button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-6 bottom-52 flex flex-col gap-4 pointer-events-auto">
          <button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl border border-white/10 backdrop-blur-xl active:scale-90">
            <span className="material-symbols-outlined">layers</span>
          </button>
          <button 
            onClick={() => setSelectedMarkerId(null)}
            className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-primary shadow-xl border border-white/10 backdrop-blur-xl active:scale-90"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Radar;
