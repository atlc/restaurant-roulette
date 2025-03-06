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
  userProfile: DEFAULT_USER_PROFILE,
  currentProfileKey: Object.keys(DEFAULT_USER_PROFILE)[0],
  newProfileName: '',
  addProfileExpanded: false,
  setUserProfile: (profile) => set({ userProfile: profile }),
  setCurrentProfileKey: (key) => set({ currentProfileKey: key }),
  setNewProfileName: (name) => set({ newProfileName: name }),
  setAddProfileExpanded: (expanded) => set({ addProfileExpanded: expanded })
}), {
  name: "profile",
}));