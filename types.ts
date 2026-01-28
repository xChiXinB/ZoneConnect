
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  EXPLORE = 'EXPLORE',
  RADAR = 'RADAR',
  ZONE = 'ZONE',
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  CHAT_LIST = 'CHAT_LIST',
  CHAT_SESSION = 'CHAT_SESSION',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE'
}

export enum UserRole {
  TOURIST = 'TOURIST',
  STUDENT = 'STUDENT',
  NONE = 'NONE'
}

export interface User {
  id: string;
  name: string;
  bio: string;
  role: UserRole;
  avatar: string;
  location?: string;
  distance?: string;
  tags: string[];
  reputation: number;
  balance: number;
  verified?: boolean;
}

export interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  translation?: string;
  time: string;
  type: 'social' | 'sos' | 'event' | 'chat';
  color?: string;
  location?: string; // New field for geo-tagging
}

export interface ChatThread {
  id: string;
  participant: User;
  lastMessage: string;
  time: string;
  unreadCount: number;
}
