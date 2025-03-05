export interface Restaurant {
    name: string;
    weight: number;
}

export interface RestaurantProfile {
    name: string;
    isActive: boolean;
    restaurants: Restaurant[];
}

export type UserProfile = {
    [key: string]: RestaurantProfile;
}