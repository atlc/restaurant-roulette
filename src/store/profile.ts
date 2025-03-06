import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {  UserProfile } from '../types'
import { DEFAULT_USER_PROFILE } from '../constants/restaurants';

interface ProfileStore {
  currentProfileKey: string;
  newProfileName: string;
  addProfileExpanded: boolean;
  userProfile: UserProfile;
  setCurrentProfileKey: (key: string) => void;
  setNewProfileName: (name: string) => void;
  setAddProfileExpanded: (expanded: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
}

export const useProfileStore = create<ProfileStore>()(persist((set) => ({
  currentProfileKey: '',
  newProfileName: '',
  addProfileExpanded: false,
  userProfile: DEFAULT_USER_PROFILE,
  setCurrentProfileKey: (key: string) => set({ currentProfileKey: key }),
  setNewProfileName: (name: string) => set({ newProfileName: name }),
  setAddProfileExpanded: (expanded: boolean) => set({ addProfileExpanded: expanded }),
  setUserProfile: (profile: UserProfile) => set({ userProfile: profile }),
}), {
  name: "profile",
}));