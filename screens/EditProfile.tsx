import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { IMAGES } from '../constants';

interface EditProfileProps {
  user: User;
  onSave: (updated: User) => void;
  onBack: () => void;
  onSignOut?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onBack, onSignOut }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [role, setRole] = useState<UserRole>(user.role);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(user.tags);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSave = () => {
    onSave({ ...user, name, bio, tags, avatar, role });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t));

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pt-8 pb-12 px-6 max-w-md mx-auto text-white">
      <header className="flex items-center justify-between mb-10 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md py-2">
        <button onClick={onBack} className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/70">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Personal Profile</h2>
        <button onClick={handleSave} className="px-6 h-12 bg-primary/20 text-primary border border-primary/30 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-glow">Save Changes</button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-8 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-2xl" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
            </div>
          </div>
          <div className="flex gap-3">
             {[IMAGES.ALEX_PORTRAIT, IMAGES.LI_WEI_PORTRAIT, IMAGES.USER_AVATAR, IMAGES.SARAH_AVATAR].map((img, i) => (
               <button 
                 key={i} 
                 onClick={() => setAvatar(img)}
                 className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${avatar === img ? 'border-primary scale-110 shadow-glow' : 'border-white/5 opacity-40'}`}
               >
                 <img src={img} className="w-full h-full object-cover" />
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Identity Role</label>
          <div className="flex gap-4">
             <button 
                onClick={() => setRole(UserRole.TOURIST)}
                className={`flex-1 h-14 rounded-2xl border flex items-center justify-center gap-2 transition-all ${role === UserRole.TOURIST ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-white/40'}`}
             >
                <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Tourist</span>
             </button>
             <button 
                onClick={() => setRole(UserRole.STUDENT)}
                className={`flex-1 h-14 rounded-2xl border flex items-center justify-center gap-2 transition-all ${role === UserRole.STUDENT ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : 'bg-white/5 border-white/5 text-white/40'}`}
             >
                <span className="material-symbols-outlined text-[20px]">school</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Student</span>
             </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 input-light rounded-2xl px-8 border-none focus:ring-4 focus:ring-primary/40 transition-all outline-none font-bold text-lg text-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Professional Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-32 glass-panel rounded-2xl p-6 border border-white/10 focus:border-primary transition-all outline-none resize-none leading-relaxed text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Expertise & Interests</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(t => (
                <button key={t} onClick={() => removeTag(t)} className="px-3 py-1.5 glass-panel rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-primary/20 text-primary">
                  {t} <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="New Tag..." 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 h-12 input-light rounded-xl px-4 border-none text-xs text-black font-bold"
              />
              <button 
                onClick={addTag} 
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-50 bg-background-dark py-4">
         <button 
           onClick={onSignOut}
           className="text-red-500/60 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
         >
           Sign Out Account
         </button>
         <span className="text-white/10 text-[9px] font-bold uppercase">Zone v2.5.0-Beijing</span>
      </div>
    </div>
  );
};

export default EditProfile;