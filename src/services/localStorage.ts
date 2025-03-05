import { RestaurantProfile, Restaurant, UserProfile } from "../types";
import  { DEFAULT_USER_PROFILE } from "../constants/restaurants";

export const USER_PROFILE_KEY = "profile";

export const getUserProfile = (): UserProfile => {
    const store = localStorage.getItem(USER_PROFILE_KEY);
    return store ? JSON.parse(store) : DEFAULT_USER_PROFILE;
};

export const persistUserProfile = (userProfile: UserProfile) => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
};
