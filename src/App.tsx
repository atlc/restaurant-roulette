import { useEffect, useState } from "react";
import "./App.css";
import { Restaurant, RestaurantProfile, UserProfile } from "./types";
import { getUserProfile, saveUserProfile } from "./services/localStorage";
import { DEFAULT_USER_PROFILE } from "./constants/restaurants";


const App = () => {
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
    const [currentProfileKey, setCurrentProfileKey] = useState<string>("keysys");
    const [newRestaurantName, setNewRestaurantName] = useState("");
    const [addRestaurantExpanded, setAddRestaurantExpanded] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [addProfileExpanded, setAddProfileExpanded] = useState(false);

    useEffect(() => {
        const profile = getUserProfile();
        setUserProfile(profile);
    }, []);

    useEffect(() => {
        const updatedProfile = {
            ...userProfile,
            [currentProfileKey]: {
                ...userProfile[currentProfileKey],
                restaurants: restaurants
            }
        };
        
        setUserProfile(updatedProfile);
        saveUserProfile(updatedProfile);
    }, [restaurants]);

    useEffect(() => {
        setRestaurants(userProfile[currentProfileKey].restaurants);
        
        const updatedUser = Object.assign({}, userProfile);
        Object.keys(updatedUser).forEach((key) => { 
            updatedUser[key].isActive = key === currentProfileKey; 
        });
        
        setUserProfile(updatedUser);
        saveUserProfile(updatedUser);
    }, [currentProfileKey]);

    const handleRemoveRestaurant = (name: string) => {
        setRestaurants(restaurants.filter((rs) => rs.name !== name));
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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddRestaurant();
        }
    };

    const handleProfileKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddProfile();
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

    const handleAddProfile = () => {
        if (newProfileName.trim() !== '') {
            // Create a sanitized key (lowercase, no spaces)
            const profileKey = newProfileName.trim().toLowerCase().replace(/\s+/g, '_');
            
            // Check if profile already exists
            if (userProfile[profileKey]) {
                alert(`A profile with the name "${newProfileName}" already exists.`);
                return;
            }
            
            // Create new profile
            const updatedProfile = {
                ...userProfile,
                [profileKey]: {
                    name: newProfileName.trim(),
                    isActive: false,
                    restaurants: []
                }
            };
            
            setUserProfile(updatedProfile);
            saveUserProfile(updatedProfile);
            setNewProfileName('');
            setCurrentProfileKey(profileKey);
            setAddProfileExpanded(false);
        }
    };

    const handleDeleteProfile = (key: string) => {
        // Don't allow deleting the last profile
        if (Object.keys(userProfile).length <= 1) {
            alert("Cannot delete the last profile. At least one profile must exist.");
            return;
        }

        // Confirm deletion
        if (!window.confirm(`Are you sure you want to delete the profile "${userProfile[key].name}"?`)) {
            return;
        }

        // Create a copy of the profile without the deleted key
        const { [key]: deletedProfile, ...remainingProfiles } = userProfile;
        
        // If we're deleting the current profile, switch to another one
        if (key === currentProfileKey) {
            const newKey = Object.keys(remainingProfiles)[0];
            setCurrentProfileKey(newKey);
        }
        
        // Update the profile
        setUserProfile(remainingProfiles);
        saveUserProfile(remainingProfiles);
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

    const toggleAddProfileSection = () => {
        setAddProfileExpanded(!addProfileExpanded);
    };

    return (
        <main>
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

            <div className="profile-section">
                <div className="profile-header">
                    <h3>Profiles</h3>
                    <div onClick={toggleAddProfileSection} className={`toggle-icon ${addProfileExpanded ? 'expanded' : ''}`}>
                        ▼
                    </div>
                </div>
                
                <div className={`add-profile-content ${addProfileExpanded ? 'expanded' : ''}`}>
                    <div className="row" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <input
                            type="text"
                            placeholder="Enter new profile name"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            onKeyPress={handleProfileKeyPress}
                        />
                        <button className="success-button" onClick={handleAddProfile}>Add Profile</button>
                    </div>
                    
                    <h4 className="profile-management-title">Manage Profiles</h4>
                    <div className="profile-management-list">
                        {Object.keys(userProfile).map((key) => (
                            <div className="profile-management-item" key={`manage-${key}`}>
                                <span>{userProfile[key].name}</span>
                                {Object.keys(userProfile).length > 1 && (
                                    <span 
                                        className="remove-btn" 
                                        onClick={() => handleDeleteProfile(key)}
                                    >
                                        ×
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="profile-list">
                    {Object.keys(userProfile).map((key) => (
                        <div 
                            className={`profile-item ${key === currentProfileKey ? 'active' : ''}`}
                            key={key}
                            onClick={() => setCurrentProfileKey(key)}
                        >
                            <span>{userProfile[key].name}</span>
                        </div>
                    ))}
                </div>
            </div>

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
                            onKeyPress={handleKeyPress}
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

            <div className="footer">
                <p>Made with ❤️ by <a className="text-green" href="https://github.com/atlc/restaurant-roulette">Cartwright</a></p>
            </div>
        </main>
    );
};

export default App;
