import { RestaurantProfile, Restaurant } from "../types";
import { INITIAL_STATE } from "../constants";

export const RESTAURANT_KEY = "restaurants";
export const RESTAURANT_PROFILE_KEY = "restaurantProfiles";

export const getRestaurants = (): Restaurant[] => {
    const store = localStorage.getItem(RESTAURANT_KEY);
    return store ? JSON.parse(store) : INITIAL_STATE;
};

export const saveRestaurants = (restaurants: Restaurant[]) => {
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(restaurants));
};