import React from 'react';
import { IMAGES } from '../constants';
import { User, UserRole } from '../types';

interface ProfileProps {
  user: User;
  onEdit?: () => void;
  isOwnProfile?: boolean;
  onBack?: () => void;
  onMessage?: () => void;
}

const MOCK_TOURIST_NEEDS = [
  { id: 'n1', user: 'James W.', avatar: IMAGES.MIKE_AVATAR, need: 'Translation at Subway Station', reward: '¥20', distance: '400m' },
  { id: 'n2', user: 'Elena K.', avatar: IMAGES.SARAH_AVATAR, need: 'Ordering food at local Hutong restaurant', reward: '¥35', distance: '1.2km' },
  { id: 'n3', user: 'Tom R.', avatar: IMAGES.USER_AVATAR, need: 'Help buying medicine at pharmacy', reward: '¥50', distance: '800m' },
];

const Profile: React.FC<ProfileProps> = ({ user, onEdit, isOwnProfile = true, onBack, onMessage }) => {
  const isStudent = user.role === UserRole.STUDENT;

  return (
    <div className="relative min-h-screen pt-8 pb-32 px-4 max-w-md mx-auto flex flex-col gap-6">
      <div className="fixed inset-0 bg-gradient-radial from-primary/10 to-transparent pointer-events-none -z-10"></div>
      
      <div className="flex items-center justify-between sticky top-0 z-50 py-2">
        {onBack ? (
          <button onClick={onBack} className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/70 backdrop-blur-md">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/40">
            <span className="material-symbols-outlined">qr_code_2</span>
          </div>
        )}
        
        {isOwnProfile ? (
          <button 
            onClick={onEdit}
            className="px-6 h-12 glass-panel rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
          </button>
        ) : (
          <button 
            onClick={onMessage}
            className="px-6 h-12 bg-primary rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-glow"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span> Message
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125"></div>
          <div className="relative w-32 h-32 rounded-full border-4 border-white/10 p-1 bg-background-dark/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          </div>
          {user.verified && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 border-4 border-background-dark shadow-glow">
              <span className="material-symbols-outlined text-[14px] fill-current">verified</span>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-6 mb-1">{user.name}</h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{user.role}</p>
        <p className="text-white/60 text-xs font-light px-8 text-center leading-relaxed">{user.bio}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {user.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/50">{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {/* Student-specific "Nearby Needs" section */}
        {isStudent && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Nearby Tourist Requests</h3>
              <span className="text-[10px] text-accent-green font-bold uppercase">3 New</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {MOCK_TOURIST_NEEDS.map((need) => (
                <div key={need.id} className="glass-panel rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                  <img src={need.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-primary uppercase mb-0.5">{need.user}</h4>
                    <p className="text-xs text-white/80 font-medium truncate">{need.need}</p>
                    <div className="flex gap-3 mt-1 text-[9px] font-bold text-white/30 uppercase">
                      <span>{need.distance}</span>
                      <span className="text-accent-green">{need.reward} Bounty</span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOwnProfile ? (
          <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white/50">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">e-CNY Balance</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[8px] font-bold uppercase">Active</span>
            </div>
            <h2 className="text-5xl font-light text-white tracking-tighter mb-8">¥ {user.balance}<span className="text-white/40 text-3xl">.00</span></h2>
            <div className="flex gap-3">
              <button className="flex-1 h-12 bg-primary rounded-full font-bold text-[10px] uppercase tracking-widest shadow-glow">Top Up</button>
              <button className="flex-1 h-12 glass-panel rounded-full font-bold text-[10px] uppercase tracking-widest">Withdraw</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col items-center text-center">
              <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-2">Distance</span>
              <span className="text-xl font-bold text-accent-blue">2.4 km</span>
            </div>
            <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col items-center text-center">
              <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-2">Language</span>
              <span className="text-xl font-bold text-accent-green">EN/CN</span>
            </div>
          </div>
        )}

        <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span> Reputation
            </h3>
            <span className="text-3xl font-bold text-primary tracking-tighter">{user.reputation}</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(user.reputation / 5) * 100}%` }}></div>
          </div>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-3">Trusted Explorer Status</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;