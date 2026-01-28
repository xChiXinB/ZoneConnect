import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { IMAGES } from '../constants';

interface OnboardingProps {
  onFinish: (user: User) => void;
}

type Step = 'ROLE' | 'PHONE' | 'OTP' | 'AUTH' | 'SETUP';

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState<Step>('ROLE');
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // Profile Data
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<string[]>(['History', 'Hutong Culture']);
  const [tagInput, setTagInput] = useState('');
  const [avatar, setAvatar] = useState(IMAGES.USER_AVATAR);

  // Real-name Auth
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [university, setUniversity] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRoleSelect = (selected: UserRole) => {
    setRole(selected);
    setStep('PHONE');
  };

  const handleVerifyOTP = () => {
    if (role === UserRole.STUDENT) {
      setStep('AUTH');
    } else {
      setStep('SETUP');
    }
  };

  const handleAuthSubmit = () => {
    if (!realName || !idNumber || !university) {
      alert("Please fill in all identity fields.");
      return;
    }
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setStep('SETUP');
    }, 1200);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  return (
    <div className="h-screen w-full bg-background-dark text-white overflow-hidden relative flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full">
        {step === 'ROLE' && (
          <div className="flex-1 flex flex-col px-8 pt-20 animate-in fade-in">
            <h1 className="text-5xl font-bold font-display tracking-tighter mb-2">Zone Connect</h1>
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-black mb-16 text-center">Beijing Digital Guide Gateway</p>
            
            <div className="space-y-6">
              <button 
                onClick={() => handleRoleSelect(UserRole.TOURIST)}
                className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:shadow-glow">
                  <span className="material-symbols-outlined text-3xl">travel_explore</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">I'm a Tourist</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Explore hidden gems in Beijing</p>
                </div>
              </button>

              <button 
                onClick={() => handleRoleSelect(UserRole.STUDENT)}
                className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">I'm a Student</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Join the local guide community</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'PHONE' && (
          <div className="flex-1 flex flex-col justify-center px-8 animate-in slide-in-from-right-8">
            <h2 className="text-4xl font-bold mb-2">Get Started</h2>
            <p className="text-white/40 text-sm mb-10">Enter your mobile number to receive a verification code</p>
            <div className="h-20 bg-white/5 rounded-3xl flex items-center px-8 border border-white/10 focus-within:border-primary transition-all">
               <span className="text-lg font-bold text-white/40 mr-4">+86</span>
               <input 
                 type="tel" 
                 placeholder="Mobile Number" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="bg-transparent border-none focus:ring-0 flex-1 text-2xl font-bold tracking-widest"
               />
            </div>
            <button 
              onClick={() => setStep('OTP')}
              disabled={phone.length < 11}
              className="mt-8 h-18 bg-primary rounded-full font-bold uppercase tracking-widest shadow-glow disabled:opacity-20"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 'OTP' && (
          <div className="flex-1 flex flex-col justify-center px-8 text-center animate-in zoom-in-95">
            <h2 className="text-4xl font-bold mb-10">Enter Code</h2>
            <div className="flex justify-center gap-4 mb-12">
              {[0,1,2,3].map(i => (
                <input 
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-16 h-20 bg-white/10 rounded-2xl text-center text-3xl font-bold border-none"
                  value={otp[i]}
                  onChange={(e) => {
                    const next = [...otp];
                    next[i] = e.target.value;
                    setOtp(next);
                    if (e.target.value && e.target.nextElementSibling) (e.target.nextElementSibling as HTMLElement).focus();
                  }}
                />
              ))}
            </div>
            <button onClick={handleVerifyOTP} className="w-full h-18 bg-primary rounded-full font-bold uppercase tracking-widest shadow-glow">Verify</button>
          </div>
        )}

        {step === 'AUTH' && (
          <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar animate-in slide-in-from-right-8 relative">
            <header className="flex items-center justify-between p-8 sticky top-0 z-50">
               <h2 className="text-3xl font-bold tracking-tight">Create Profile</h2>
               <button className="px-8 h-12 glass-panel border-primary/40 text-primary rounded-full font-black text-[10px] uppercase tracking-widest">SAVE</button>
            </header>

            <div className="flex flex-col items-center px-8 pb-20">
              <div className="relative mt-4 mb-12">
                <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full scale-110"></div>
                <div className="relative w-40 h-40 rounded-full border-[6px] border-primary p-1 bg-background-dark overflow-hidden shadow-glow">
                  <img src={IMAGES.USER_AVATAR} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-12 h-12 bg-primary rounded-full border-[4px] border-background-dark flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
              </div>

              {/* Real-name Auth Card */}
              <div className="w-full bg-[#1a1a1c] rounded-[3rem] p-8 border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#002d33] flex items-center justify-center text-accent-blue border border-accent-blue/30">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Verification</h3>
                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">REQUIRED FOR STUDENT GUIDES</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">FULL NAME</label>
                    <input 
                      type="text"
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder="Legal name on ID"
                      className="w-full h-16 bg-[#e8e8e8] rounded-2xl px-6 border-none text-lg font-bold text-black placeholder:text-black/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">ID / PASSPORT NUMBER</label>
                    <input 
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="18-digit ID or Passport"
                      className="w-full h-16 bg-[#e8e8e8] rounded-2xl px-6 border-none text-lg font-bold text-black placeholder:text-black/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">UNIVERSITY</label>
                    <input 
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Peking University"
                      className="w-full h-16 bg-[#e8e8e8] rounded-2xl px-6 border-none text-lg font-bold text-black placeholder:text-black/30"
                    />
                  </div>
                  
                  {/* REQUESTED CHANGE: Upload button replaced with Verify button */}
                  <button 
                    onClick={handleAuthSubmit}
                    disabled={isVerifying}
                    className="w-full h-18 bg-[#282a2e] rounded-2xl flex items-center justify-center gap-4 text-white hover:bg-white/10 transition-all border border-white/5 active:scale-95 shadow-xl"
                  >
                    {isVerifying ? (
                      <span className="text-[10px] font-black tracking-widest animate-pulse uppercase">VERIFYING...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-2xl">shield_moon</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">VERIFY NOW</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'SETUP' && (
          <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-8 p-8">
            <h2 className="text-3xl font-bold mb-10 text-center">Complete Profile</h2>
            
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should others see you?"
                  className="w-full h-16 bg-white/5 rounded-2xl px-6 border border-white/10 text-xl font-bold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Personal Bio</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full h-32 bg-white/5 rounded-2xl p-6 border border-white/10 resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Expertise Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     className="flex-1 h-12 bg-white/5 rounded-xl border-white/10 px-4 text-xs"
                     placeholder="Add new tag..."
                   />
                   <button onClick={addTag} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-bold text-xl">+</button>
                </div>
              </div>

              <button 
                onClick={() => onFinish({
                   id: 'me',
                   name: name || 'Explorer',
                   bio: bio || 'Loves Beijing life.',
                   role: role,
                   avatar: avatar,
                   tags: tags,
                   reputation: 5.0,
                   balance: 0,
                   verified: role === UserRole.STUDENT
                })}
                className="w-full h-18 bg-primary rounded-full font-bold uppercase tracking-[0.2em] shadow-glow active:scale-95 transition-all"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;