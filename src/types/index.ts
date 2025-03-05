export interface Restaurant {
    name: string;
    weight: number;
}

export interface RestaurantProfile {
    name: string;
    isActive: boolean;
    restaurants: Restaurant[];
}

export interface UserProfile {
    [key: string]: RestaurantProfile;
}
export interface ConfirmationModal {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}