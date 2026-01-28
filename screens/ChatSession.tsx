
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import { IMAGES } from '../constants';

interface ChatSessionProps {
  partner: User;
  onBack: () => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ partner, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: partner.id,
      senderAvatar: partner.avatar,
      content: `Hello! I noticed you're exploring Sanlitun. Need any tips?`,
      time: '1h ago',
      type: 'chat'
    },
    {
      id: '2',
      sender: 'me',
      senderAvatar: IMAGES.USER_AVATAR,
      content: 'Hey! Yes, looking for some quiet cafes actually.',
      time: '45m ago',
      type: 'chat'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Call Timer
  useEffect(() => {
    let interval: number | undefined;
    if (isVideoCalling) {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => window.clearInterval(interval);
  }, [isVideoCalling]);

  const startVideoCall = async () => {
    setIsVideoCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      // Fallback: still show the UI but maybe with a warning
    }
  };

  const endVideoCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsVideoCalling(false);
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      senderAvatar: IMAGES.USER_AVATAR,
      content: inputValue,
      time: 'Just now',
      type: 'chat'
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background-dark text-white relative">
      {/* Header */}
      <header className="px-6 py-4 glass-panel border-b border-white/10 flex items-center gap-4 sticky top-0 z-50 backdrop-blur-2xl">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={partner.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt={partner.name} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-background-dark"></div>
          </div>
          <div>
            <h2 className="text-sm font-bold truncate max-w-[150px]">{partner.name}</h2>
            <span className="text-[8px] font-bold uppercase tracking-widest text-accent-green">Active Now</span>
          </div>
        </div>
        <div className="flex-1"></div>
        <button 
          onClick={startVideoCall}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-primary transition-all active:scale-90"
        >
          <span className="material-symbols-outlined">videocam</span>
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(230,66,51,0.05),transparent)]">
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {!isMe && <img src={msg.senderAvatar} className="w-8 h-8 rounded-full object-cover mt-1 shrink-0" alt="" />}
              <div className={`flex flex-col gap-1.5 max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary text-white rounded-tr-none shadow-glow' : 'glass-panel rounded-tl-none border border-white/10 text-white/90'}`}>
                  {msg.content}
                </div>
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{msg.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-6 pb-10 bg-background-dark/80 backdrop-blur-xl border-t border-white/5 relative z-10">
        <div className="flex items-end gap-3 max-w-md mx-auto">
          <button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white/40 border-white/10 hover:text-white">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <div className="flex-1 relative">
            <textarea 
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="w-full max-h-32 bg-white/5 rounded-3xl px-5 py-3.5 border border-white/10 focus:border-primary transition-all outline-none text-sm resize-none text-white caret-yellow"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-primary disabled:opacity-30 rounded-full flex items-center justify-center text-white shadow-glow transition-all active:scale-90"
          >
            <span className="material-symbols-outlined fill-current">send</span>
          </button>
        </div>
      </div>

      {/* Video Call Overlay */}
      {isVideoCalling && (
        <div className="fixed inset-0 z-[200] bg-background-dark animate-in fade-in duration-500 overflow-hidden flex flex-col">
          {/* Main Feed: Partner */}
          <div className="absolute inset-0 z-0">
             <img src={partner.avatar} className="w-full h-full object-cover opacity-60 blur-sm" alt="" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          </div>

          {/* Call Info Header */}
          <div className="relative z-10 px-6 pt-16 flex flex-col items-center">
             <div className="flex flex-col items-center gap-4">
                <img src={partner.avatar} className="w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl animate-pulse" alt="" />
                <div className="text-center">
                   <h2 className="text-2xl font-bold tracking-tight">{partner.name}</h2>
                   <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Encrypted Video Session</p>
                </div>
                <div className="px-4 py-2 glass-panel rounded-full flex items-center gap-2 border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></div>
                   <span className="text-xs font-mono font-bold">{formatTime(callDuration)}</span>
                </div>
             </div>
          </div>

          <div className="flex-1"></div>

          {/* Local Preview (PiP) */}
          <div className="relative z-20 px-6 mb-12 flex justify-end">
             <div className="w-32 h-44 rounded-2xl overflow-hidden glass-panel border border-white/20 shadow-2xl transform rotate-2">
                <video 
                  ref={localVideoRef}
                  autoPlay 
                  muted 
                  playsInline 
                  className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <span className="material-symbols-outlined text-white/40 text-3xl">videocam_off</span>
                  </div>
                )}
             </div>
          </div>

          {/* Controls */}
          <div className="relative z-30 pb-16 px-6 flex justify-center items-center gap-6">
             <button 
               onClick={() => setIsMuted(!isMuted)}
               className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'glass-panel text-white/60 border-white/10 hover:text-white'}`}
             >
                <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
             </button>

             <button 
               onClick={endVideoCall}
               className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-all group"
             >
                <span className="material-symbols-outlined text-4xl transform rotate-[135deg] group-hover:scale-110 transition-transform">call_end</span>
             </button>

             <button 
               onClick={() => setIsVideoOff(!isVideoOff)}
               className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-white text-black' : 'glass-panel text-white/60 border-white/10 hover:text-white'}`}
             >
                <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSession;
