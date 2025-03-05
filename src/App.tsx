import { useEffect, useState } from "react";
import "./App.css";
import { Restaurant, UserProfile, ConfirmationModal } from "./types";
import { getUserProfile, persistUserProfile } from "./services/localStorage";
import { DEFAULT_USER_PROFILE, INITIAL_MODAL_STATE } from "./constants/restaurants";
import Modal from "./components/Modal";
import Profile from "./components/Profile";

const App = () => {
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
    const [currentProfileKey, setCurrentProfileKey] = useState<string>("keysys");
    const [newRestaurantName, setNewRestaurantName] = useState("");
    const [addRestaurantExpanded, setAddRestaurantExpanded] = useState(false);
    const [confirmModal, setConfirmModal] = useState<ConfirmationModal>(INITIAL_MODAL_STATE);

    const resetModal = () => {
        setConfirmModal(INITIAL_MODAL_STATE);
    }

    useEffect(() => {
        const profile = getUserProfile();
        setUserProfile(profile);
    }, []);

    useEffect(() => {
        persistUserProfile(userProfile);
    }, [userProfile])
    
    useEffect(() => {
        const updatedProfile = {
            ...userProfile,
            [currentProfileKey]: {
                ...userProfile[currentProfileKey],
                restaurants
            }
        };
        
        setUserProfile(updatedProfile);
    }, [restaurants]);

    useEffect(() => {
        setRestaurants(userProfile[currentProfileKey].restaurants);
        
        const updatedUser = Object.assign({}, userProfile);
        Object.keys(updatedUser).forEach((key) => { 
            updatedUser[key].isActive = key === currentProfileKey; 
        });
        
        setUserProfile(updatedUser);
    }, [currentProfileKey]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && confirmModal.isOpen) {
                confirmModal.onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [confirmModal]);

    const handleRemoveRestaurant = (name: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Remove Restaurant",
            message: `Are you sure you want to remove "${name}" from your list?`,
            onConfirm: () => {
                setRestaurants(restaurants.filter((rs) => rs.name !== name));
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleAdjustWeights = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temp = Array.from(restaurants);
        const index = temp.findIndex((rs) => rs.name === e.target.name);
        temp[index].weight = e.target.valueAsNumber;
        setRestaurants(temp);
    };

    const handleResetWeight = () => {
        setRestaurants(restaurants.map((rs) => ({ ...rs, weight: 0.5 })));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddRestaurant();
        }
    };

    const handleAddRestaurant = () => {
        if (newRestaurantName.trim() !== '') {
            const newRestaurant: Restaurant = {
                name: newRestaurantName,
                weight: 0.5
            };
            setRestaurants([...restaurants, newRestaurant]);
            setNewRestaurantName('');
        }
    };

    const calculateRandomChoice = () => {
        const allChoicesWeight = restaurants.reduce((sum, restaurant) => sum + restaurant.weight, 0);

        if (!allChoicesWeight) {
            setChoice("Nothing!");
            return;
        }
        let random = Math.random() * allChoicesWeight;
        let randomChoice = null;

        for (const restaurant of restaurants) {
            random -= restaurant.weight;
            if (random <= 0) {
                randomChoice = restaurant.name;
                break;
            }
        }

        if (!randomChoice && restaurants.length) {
            randomChoice = restaurants[restaurants.length - 1].name;
        }

        setChoice(randomChoice || "Nothing!");
    };

    const getWeightDescription = (weight: number): string => {
        if (weight === 0) return "NOT TODAY";
        if (weight < 0.2) return "Pls no";
        if (weight < 0.4) return "Meh";
        if (weight < 0.6) return "Neutral";
        if (weight < 0.8) return "Maybe";
        return "Fingers crossed!";
    };

    const getWeightColor = (weight: number): string => {
        if (weight === 0) return "#ff0000";
        if (weight < 0.2) return "#ff6b6b";
        if (weight < 0.4) return "#ffa56b";
        if (weight < 0.6) return "#f5f5f5";
        if (weight < 0.8) return "#6bffb5";
        return "#6bff6b";
    };

    const toggleAddRestaurantSection = () => {
        setAddRestaurantExpanded(!addRestaurantExpanded);
    };

    const showPrivacyPolicy = () => {
        setConfirmModal({
            isOpen: true,
            title: "Privacy Policy",
            message: "Your data is not collected or shared with or by anyone. No cookies or tracking are used. All data is stored only locally, only in your browser.",
            onConfirm: resetModal,
            onCancel: resetModal,
            showButtons: false
        });
    }

    return (
        <main>
            <Profile
                userProfile={userProfile}
                currentProfileKey={currentProfileKey}
                setConfirmModal={setConfirmModal}
             />

            <div className="add-restaurant-section">
                <div className="add-restaurant-header" onClick={toggleAddRestaurantSection}>
                    <h3>Add New Restaurant for <span className="underline">{userProfile[currentProfileKey].name}</span></h3>
                    <div onClick={toggleAddRestaurantSection} className={`toggle-icon ${addRestaurantExpanded ? 'expanded' : ''}`}>
                        ▼
                    </div>
                </div>
                <div className={`add-restaurant-content ${addRestaurantExpanded ? 'expanded' : ''}`}>
                    <div className="row" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <input
                            type="text"
                            placeholder="Enter restaurant name"
                            value={newRestaurantName}
                            onChange={(e) => setNewRestaurantName(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="success-button" onClick={handleAddRestaurant}>Add</button>
                    </div>
                </div>
            </div>

            <div className="container">
                {restaurants.length === 0 ? (
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <p>No restaurants added yet. Add some above!</p>
                    </div>
                ) : (
                    restaurants.map((rs, i) => (
                        <div className="row" key={`restaurant-div-${i}`}>
                            <div className="col-left">
                                <label>{rs.name}</label>
                            </div>
                            <div className="col-right">
                                <div className="weight-container">
                                    <input
                                        className="center-vert"
                                        onChange={handleAdjustWeights}
                                        name={rs.name}
                                        type="range"
                                        step={0.05}
                                        value={rs.weight}
                                        max={1}
                                    />
                                    <span
                                        className="weight-label"
                                        style={{ color: getWeightColor(rs.weight) }}
                                    >
                                        {getWeightDescription(rs.weight)}
                                    </span>
                                </div>
                                <span
                                    className="remove-btn"
                                    onClick={() => handleRemoveRestaurant(rs.name)}
                                >
                                    ×
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="random-choice-section">
                <div>
                    <button onClick={handleResetWeight}>Reset Weights</button>
                    <button onClick={calculateRandomChoice}>
                        {!choice ? "Random Choice!" : "Try Again?"}
                    </button>
                </div>
                <h1>
                    <strong>{choice || "Ready to choose!"}</strong>
                </h1>
            </div>

            <div className="footer">
                <p>Made with ❤️ by <a className="text-green" href="https://github.com/atlc/restaurant-roulette">Cartwright</a></p>
                <p className="text-green" onClick={showPrivacyPolicy}>Privacy Policy</p>
            </div>

            {confirmModal.isOpen && <Modal {...confirmModal} />}
        </main>
    );
};

export default App;
