import { useEffect, useState } from "react";
import "./App.css";
import { Restaurant } from "./types";
import Modal from "./components/Modal";
import Profile from "./components/Profile";
import { useModalStore, useProfileStore } from "./store";
import Footer from "./components/Footer";

const App = () => {
    const currentProfileKey = useProfileStore(store => store.currentProfileKey)
    const userProfile = useProfileStore(store => store.userProfile);
    const setUserProfile = useProfileStore(store => store.setUserProfile);
    
    const launchModal = useModalStore(store => store.launch)
    
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [newRestaurantName, setNewRestaurantName] = useState("");
    const [addRestaurantExpanded, setAddRestaurantExpanded] = useState(false);
    
    useEffect(() => {
        if (!userProfile[currentProfileKey]) return;
        
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
        if (!userProfile[currentProfileKey]) return;
        
        setRestaurants(userProfile[currentProfileKey].restaurants);
        
        const updatedUser = Object.assign({}, userProfile);
        Object.keys(updatedUser).forEach((key) => { 
            updatedUser[key].isActive = key === currentProfileKey; 
        });
        
        setUserProfile(updatedUser);
    }, [currentProfileKey]);


    const handleRemoveRestaurant = (name: string) => {
        launchModal({
            title: "Remove Restaurant",
            message: `Are you sure you want to remove "${name}" from your list?`,
            onConfirm: () => setRestaurants(restaurants.filter((rs) => rs.name !== name))
        })
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

    return (
        <main>
            <Modal />
            <Profile />

            <div className="add-restaurant-section">
                <div className="add-restaurant-header" onClick={toggleAddRestaurantSection}>
                    <h3>Add New Restaurant for <span className="underline">
                        {userProfile[currentProfileKey]?.name || 'Loading...'}
                    </span></h3>
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

            <Footer />
        </main>
    );
};

export default App;
