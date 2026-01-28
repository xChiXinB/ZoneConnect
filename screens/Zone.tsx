import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { Message, ChatThread, User, UserRole } from '../types';

interface ZoneProps {
  initialTab?: 'ZONE' | 'CHATS';
  onSelectChat: (partner: User) => void;
}

const MOCK_THREADS: ChatThread[] = [
  {
    id: 't1',
    participant: {
      id: 'sarah',
      name: 'Sarah J.',
      avatar: IMAGES.SARAH_AVATAR,
      bio: 'Exploring Beijing...',
      role: UserRole.TOURIST,
      tags: [],
      reputation: 4.7,
      balance: 100
    },
    lastMessage: 'Let’s go to Sanlitun tonight!',
    time: '2m ago',
    unreadCount: 2
  },
  {
    id: 't2',
    participant: {
      id: 'li-wei',
      name: 'Li Wei',
      avatar: IMAGES.LI_WEI_PORTRAIT,
      bio: 'Guide for Hutongs.',
      role: UserRole.STUDENT,
      tags: [],
      reputation: 4.9,
      balance: 50
    },
    lastMessage: 'The Forbidden City tickets are booked.',
    time: '1h ago',
    unreadCount: 0
  }
];

const Zone: React.FC<ZoneProps> = ({ initialTab = 'ZONE', onSelectChat }) => {
  const [activeTab, setActiveTab] = useState<'ZONE' | 'CHATS'>(initialTab);
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [taggedLocation, setTaggedLocation] = useState<string | null>(null);
  
  const [zoneMessages, setZoneMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'SARAH J.',
      senderAvatar: IMAGES.SARAH_AVATAR,
      content: 'Anyone know a good quiet café near Taikoo Li? ☕️',
      translation: 'Looking for a peaceful spot to read.',
      time: '2m ago',
      type: 'social',
      color: 'social-blue',
      location: 'Sanlitun Taikoo Li'
    },
    {
      id: '2',
      sender: 'SOS SIGNAL',
      senderAvatar: IMAGES.MIKE_AVATAR,
      content: 'Need translation help at the police station!',
      translation: 'Emergency assistance required for visa issue.',
      time: 'Just now',
      type: 'sos',
      color: 'primary',
      location: 'Dongzhimen Police Station'
    },
    {
      id: '3',
      sender: 'MUSICFAN',
      senderAvatar: IMAGES.MUSIC_AVATAR,
      content: 'Open mic night starting in 10 mins! 🎤',
      translation: 'Live performance in the art district.',
      time: '10m ago',
      type: 'event',
      color: 'purple-500',
      location: '798 Art District'
    }
  ]);

  const handlePost = () => {
    if (!postContent.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'YOU',
      senderAvatar: IMAGES.USER_AVATAR,
      content: postContent,
      translation: 'Signal broadcasted to nearby peers.',
      time: 'Just now',
      type: 'social',
      color: 'accent-blue',
      location: taggedLocation || undefined
    };
    setZoneMessages([newMessage, ...zoneMessages]);
    setPostContent('');
    setTaggedLocation(null);
    setIsPosting(false);
  };

  const toggleLocation = () => {
    if (taggedLocation) setTaggedLocation(null);
    else setTaggedLocation('Current: Sanlitun Soho');
  };

  return (
    <div className="relative min-h-screen flex flex-col pt-6 pb-32 bg-background-dark text-white">
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `url("${IMAGES.MAP_PATTERN}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>

      <header className="px-4 mb-6 relative z-10">
        <div className="glass-panel rounded-full p-2 pl-4 shadow-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Current Zone</span>
              <h2 className="text-white text-sm font-bold truncate max-w-[180px]">Chaoyang · Sanlitun</h2>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden shadow-lg">
            <img src={IMAGES.USER_AVATAR} alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="px-6 mb-8 relative z-10">
        <div className="relative flex h-12 w-full items-center rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/5">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white/10 border border-white/10 shadow-inner transition-all duration-300 ${activeTab === 'ZONE' ? 'left-1' : 'left-[calc(50%+2px)]'}`}></div>
          <button 
            onClick={() => setActiveTab('ZONE')}
            className={`relative z-10 flex-1 h-full font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'ZONE' ? 'text-white' : 'text-white/40'}`}
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span> Zone
          </button>
          <button 
            onClick={() => setActiveTab('CHATS')}
            className={`relative z-10 flex-1 h-full font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'CHATS' ? 'text-white' : 'text-white/40'}`}
          >
            <span className="material-symbols-outlined text-[18px]">forum</span> Chats
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 flex flex-col gap-6 relative z-10 overflow-y-auto no-scrollbar">
        {activeTab === 'ZONE' ? (
          <>
            {zoneMessages.map((msg, idx) => (
              <div key={msg.id} className={`flex flex-col gap-2 ${idx % 2 === 1 ? 'items-end' : ''}`}>
                <div className={`flex gap-4 max-w-[90%] ${idx % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  <img 
                    src={msg.senderAvatar} 
                    alt={msg.sender} 
                    className={`w-10 h-10 rounded-full border border-white/20 shadow-lg shrink-0 ${msg.type === 'sos' ? 'border-primary shadow-glow' : ''}`}
                  />
                  <div className={`relative p-5 rounded-2xl ${idx % 2 === 1 ? 'rounded-tr-none' : 'rounded-tl-none'} ${msg.type === 'sos' ? 'bg-primary/90' : 'glass-panel'} backdrop-blur-xl border border-white/10`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold tracking-widest uppercase ${msg.type === 'sos' ? 'text-white' : 'text-primary'}`}>
                        {msg.type === 'sos' && <span className="material-symbols-outlined text-[12px] animate-pulse mr-1">warning</span>}
                        {msg.sender}
                      </span>
                      <span className="text-[9px] text-white/40 font-bold">{msg.time}</span>
                    </div>
                    
                    {msg.location && (
                      <div className="flex items-center gap-1 mb-2 px-2 py-0.5 bg-black/20 rounded-md w-fit border border-white/5">
                        <span className="material-symbols-outlined text-[10px] text-accent-blue">location_on</span>
                        <span className="text-[9px] font-bold text-white/60 tracking-wider uppercase">{msg.location}</span>
                      </div>
                    )}

                    <p className="text-sm font-medium leading-relaxed mb-2">{msg.content}</p>
                    <div className={`h-px w-full my-2 ${msg.type === 'sos' ? 'bg-white/20' : 'bg-white/5'}`}></div>
                    <p className={`text-xs italic ${msg.type === 'sos' ? 'text-white/90 font-bold' : 'text-white/50'}`}>{msg.translation}</p>
                    
                    {msg.type === 'sos' && (
                      <button className="mt-4 w-full py-2.5 rounded-xl bg-black/20 hover:bg-black/30 transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">translate</span> Offer Assistance
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {MOCK_THREADS.map((thread) => (
              <button 
                key={thread.id}
                onClick={() => onSelectChat(thread.participant)}
                className="flex items-center gap-4 p-4 glass-panel rounded-3xl border border-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="relative">
                  <img src={thread.participant.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10" alt={thread.participant.name} />
                  {thread.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background-dark shadow-glow">
                      {thread.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold truncate">{thread.participant.name}</h3>
                    <span className="text-[10px] text-white/30">{thread.time}</span>
                  </div>
                  <p className="text-xs text-white/50 truncate font-light leading-snug">{thread.lastMessage}</p>
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-28 right-6 z-40">
        <button 
          onClick={() => setIsPosting(true)}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[28px]">{activeTab === 'ZONE' ? 'add' : 'search'}</span>
        </button>
      </div>

      {isPosting && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-md glass-panel rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold tracking-tight">Post to Zone</h2>
                 <button onClick={() => { setIsPosting(false); setTaggedLocation(null); }} className="text-white/40 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              
              <textarea 
                autoFocus
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's happening in your frequency?"
                className="w-full h-40 bg-white/5 rounded-2xl p-4 border border-white/10 focus:border-primary transition-all outline-none text-sm leading-relaxed resize-none text-white mb-6 caret-yellow"
              />

              {taggedLocation && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 animate-in slide-in-from-left-4">
                  <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{taggedLocation}</span>
                  <button onClick={() => setTaggedLocation(null)} className="ml-auto text-primary/40">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                 <button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/40 border-white/10 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">image</span>
                 </button>
                 <button 
                   onClick={toggleLocation}
                   className={`w-12 h-12 glass-panel rounded-full flex items-center justify-center transition-colors ${taggedLocation ? 'bg-primary/20 text-primary border-primary/50' : 'text-white/40 border-white/10 hover:text-primary'}`}
                 >
                    <span className="material-symbols-outlined">location_on</span>
                 </button>
                 <button 
                   onClick={handlePost}
                   disabled={!postContent.trim()}
                   className="flex-1 h-12 bg-primary disabled:opacity-30 rounded-full font-bold text-xs uppercase tracking-widest shadow-glow flex items-center justify-center gap-2 transition-all"
                 >
                   Broadcast Signal <span className="material-symbols-outlined text-[16px]">sensors</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Zone;