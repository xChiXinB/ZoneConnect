import React, { useState, useEffect } from 'react';
import { Screen, UserRole, User } from './types';
import Onboarding from './screens/Onboarding';
import Explore from './screens/Explore';
import Radar from './screens/Radar';
import Zone from './screens/Zone';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import ChatSession from './screens/ChatSession';
import NavBar from './components/NavBar';
import { IMAGES } from './constants';

const STORAGE_KEY = 'zone_connect_v1_store';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [user, setUser] = useState<User>({
    id: 'me',
    name: 'New User',
    bio: 'Exploring Beijing...',
    role: UserRole.NONE,
    avatar: IMAGES.USER_AVATAR,
    tags: ['Culture', 'Food'],
    reputation: 5.0,
    balance: 0
  });

  // Load user data on startup
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setCurrentScreen(Screen.EXPLORE);
      } catch (e) {
        console.error("Failed to load local session", e);
      }
    }
    setTimeout(() => setIsInitialized(true), 1000);
  }, []);

  const handleFinishOnboarding = (finalUser: User) => {
    setUser(finalUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
    setCurrentScreen(Screen.EXPLORE);
  };

  const handleSaveProfile = (updated: User) => {
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentScreen(Screen.PROFILE);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const navigateToChat = (target: User) => {
    setSelectedUser(target);
    setCurrentScreen(Screen.CHAT_SESSION);
  };

  const navigateToPublicProfile = (target: User) => {
    setSelectedUser(target);
    setCurrentScreen(Screen.PUBLIC_PROFILE);
  };

  if (!isInitialized) {
    return (
      <div className="h-screen w-full bg-background-dark flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center shadow-glow animate-pulse">
            <span className="material-symbols-outlined text-white text-4xl">cell_tower</span>
          </div>
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full"></div>
        </div>
        <h1 className="mt-8 text-xl font-bold font-display tracking-[0.4em] uppercase opacity-30">Zone Connect</h1>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <Onboarding onFinish={handleFinishOnboarding} />;
      case Screen.EXPLORE:
        return <div className="animate-in-view"><Explore currentUserRole={user.role} onConnect={navigateToChat} /></div>;
      case Screen.RADAR:
        return <div className="animate-in-view"><Radar onViewProfile={navigateToPublicProfile} onChat={navigateToChat} /></div>;
      case Screen.ZONE:
      case Screen.CHAT_LIST:
        return <div className="animate-in-view"><Zone initialTab={currentScreen === Screen.CHAT_LIST ? 'CHATS' : 'ZONE'} onSelectChat={navigateToChat} /></div>;
      case Screen.CHAT_SESSION:
        return selectedUser ? (
          <div className="animate-in-view"><ChatSession partner={selectedUser} onBack={() => setCurrentScreen(Screen.ZONE)} /></div>
        ) : <Explore currentUserRole={user.role} onConnect={navigateToChat} />;
      case Screen.PROFILE:
        return <div className="animate-in-view"><Profile user={user} onEdit={() => setCurrentScreen(Screen.EDIT_PROFILE)} /></div>;
      case Screen.PUBLIC_PROFILE:
        return selectedUser ? (
          <div className="animate-in-view"><Profile user={selectedUser} isOwnProfile={false} onBack={() => setCurrentScreen(Screen.EXPLORE)} onMessage={() => navigateToChat(selectedUser)} /></div>
        ) : <Explore currentUserRole={user.role} onConnect={navigateToChat} />;
      case Screen.EDIT_PROFILE:
        return <div className="animate-in-view"><EditProfile user={user} onSave={handleSaveProfile} onBack={() => setCurrentScreen(Screen.PROFILE)} onSignOut={handleSignOut} /></div>;
      default:
        return <Explore currentUserRole={user.role} onConnect={navigateToChat} />;
    }
  };

  const showNav = ![Screen.ONBOARDING, Screen.EDIT_PROFILE, Screen.CHAT_SESSION].includes(currentScreen);

  return (
    <div className="relative h-screen w-full flex flex-col font-display overflow-hidden bg-background-dark text-white">
      <main className="flex-1 overflow-y-auto no-scrollbar pt-safe pb-safe">
        {renderScreen()}
      </main>

      {showNav && (
        <NavBar 
          activeScreen={currentScreen === Screen.CHAT_LIST ? Screen.ZONE : currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      )}
    </div>
  );
};

export default App;