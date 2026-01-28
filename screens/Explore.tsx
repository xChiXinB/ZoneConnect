import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { User, UserRole } from '../types';

interface ExploreProps {
  currentUserRole: UserRole;
  onConnect: (user: User) => void;
}

const MOCK_COMMUNITY: User[] = [
  {
    id: '1',
    name: 'Li, Peking Univ',
    avatar: IMAGES.STUDENT_PORTRAIT,
    tags: ['#History', '#Art', '#Architecture'],
    bio: 'Peking University History student. Let me show you the real hidden Hutongs.',
    role: UserRole.STUDENT,
    reputation: 4.9,
    balance: 0,
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Jordan',
    avatar: IMAGES.SARAH_AVATAR,
    tags: ['#Foodie', '#Nightlife', '#Coffee'],
    bio: 'Expat foodie living in Sanlitun for 3 years. Best cocktails in town!',
    role: UserRole.TOURIST,
    reputation: 4.7,
    balance: 0,
    verified: false
  },
  {
    id: '3',
    name: 'Mike Chen',
    avatar: IMAGES.MIKE_AVATAR,
    tags: ['#Photography', '#Retro', '#Tech'],
    bio: 'Professional photographer. I know the best angles for your Forbidden City trip.',
    role: UserRole.TOURIST,
    reputation: 5.0,
    balance: 0,
    verified: true
  },
  {
    id: '4',
    name: 'Wei Zhang',
    avatar: IMAGES.LI_WEI_PORTRAIT,
    tags: ['#Temple', '#Zen', '#Tea'],
    bio: 'Tsinghua student focused on traditional tea ceremonies and temple architecture.',
    role: UserRole.STUDENT,
    reputation: 4.8,
    balance: 0,
    verified: true
  }
];

const Explore: React.FC<ExploreProps> = ({ currentUserRole, onConnect }) => {
  const [activeFilter, setActiveFilter] = useState('Recommended');
  const filters = ['Recommended', '#History', '#Foodie', '#Nightlife', '#Photography', '#Art', '#Tech'];

  const baseCommunity = MOCK_COMMUNITY.filter(member => {
    if (currentUserRole === UserRole.TOURIST) return member.role === UserRole.STUDENT;
    if (currentUserRole === UserRole.STUDENT) return member.role === UserRole.TOURIST;
    return true;
  });

  const filteredCommunity = activeFilter === 'Recommended' 
    ? baseCommunity 
    : baseCommunity.filter(user => user.tags.some(t => t === activeFilter));

  return (
    <div className="relative min-h-screen pt-36 pb-28 px-4 max-w-md mx-auto">
      <div className="fixed top-0 left-0 w-full h-[35%] bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
      
      <header className="fixed top-0 left-0 right-0 z-40 pt-6 px-4 bg-background-dark/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-md mx-auto mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">
              {currentUserRole === UserRole.TOURIST ? 'Find a Local Guide' : 'Visitors Nearby'}
            </h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
              {currentUserRole === UserRole.TOURIST ? 'Connect with students' : 'Help tourists explore'}
            </p>
          </div>
          <div className="flex gap-3">
             <button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-white/60">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
             </button>
             <button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
             </button>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 max-w-md mx-auto">
          {filters.map(f => {
            const isActive = activeFilter === f;
            return (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f)}
                className={`px-5 h-9 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white shadow-glow border-transparent' 
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex flex-col gap-8 mt-4">
        {filteredCommunity.map((user) => (
          <div key={user.id} className="relative group rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="aspect-[4/5] relative overflow-hidden">
               <img src={user.avatar} alt={user.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
               
               <div className="absolute top-5 left-5 flex flex-col gap-2">
                 <div className="px-3 py-1 glass-panel rounded-full text-[8px] font-bold uppercase tracking-widest text-white/90 border border-white/10">
                   Mandarin, English
                 </div>
                 {user.verified && (
                   <div className="px-3 py-1 glass-panel rounded-full flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                     <span className="material-symbols-outlined text-[10px] fill-current">verified</span> Verified
                   </div>
                 )}
               </div>

               <div className="absolute top-5 right-5">
                  <div className="w-10 h-10 glass-panel rounded-full flex items-center justify-center backdrop-blur-3xl border border-white/20">
                     <span className="material-symbols-outlined text-white text-[20px]">favorite</span>
                  </div>
               </div>
            </div>

            <div className="p-6 pt-0 -mt-20 relative z-10">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                   <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                   <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                      <span className="material-symbols-outlined text-primary text-[14px] fill-current">star</span>
                      <span className="text-xs font-bold text-white">{user.reputation}</span>
                   </div>
                </div>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{user.role}</p>
              </div>
              
              <p className="text-sm text-white/60 mb-6 line-clamp-2 font-light leading-relaxed">{user.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {user.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setActiveFilter(tag)}
                    className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => onConnect(user)}
                className="w-full h-14 glass-panel rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10"
              >
                {currentUserRole === UserRole.TOURIST ? 'Book a Session' : 'Offer Assistance'}
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Explore;