import { ConfirmationModal, Restaurant, UserProfile } from "../types";

export const DEFAULT_BIRMINGHAM_RESTAURANTS: Restaurant[] = [
    { name: "Hotbox", weight: 0.5 },
    { name: "Paramount", weight: 0.5 },
    { name: "Eugene's", weight: 0.5 },
    { name: "Makarios", weight: 0.5 },
    { name: "Saw's", weight: 0.5 },
    { name: "Great Wall", weight: 0.5 },
    { name: "El Barrio", weight: 0.5 },
    { name: "Giuseppe's", weight: 0.5 },
];

const DEFAULT_KEYSYS_RESTAURANTS: Restaurant[] = [
    { name: "Davenports", weight: 0.8 },
    { name: "Waldo's", weight: 0.5 },
    { name: "Maro", weight: 0.5 },
    { name: "Buffalo Wild Wings", weight: 0.5 },
    { name: "Chick-fil-A", weight: 0.5 },
    { name: "Milo's", weight: 0.5 },
    { name: "Zaxby's", weight: 0.5 },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
    keysys: {
        isActive: true,
        name: "KeySys HQ",
        restaurants: DEFAULT_KEYSYS_RESTAURANTS,
    },
    downtown: {
        isActive: false,
        name: "Downtown",
        restaurants: DEFAULT_BIRMINGHAM_RESTAURANTS,
    },
};

export const INITIAL_MODAL_STATE: ConfirmationModal = {
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    onCancel: () => { }
}
