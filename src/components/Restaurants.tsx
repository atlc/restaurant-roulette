import { useState, useEffect } from 'react';
import { Restaurant } from '../types'
import { useModalStore, useProfileStore } from '../store';

const Restaurants = () => {
    const [choice, setChoice] = useState("");
    const [totalWeight, setTotalWeight] = useState(0);

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [newRestaurantName, setNewRestaurantName] = useState("");
    const [restaurantWeightsExpanded, setRestaurantWeightsExpanded] = useState(false);

    const launchModal = useModalStore(store => store.launch);
    const setIsOpen = useModalStore(store => store.setIsOpen)

    const userProfile = useProfileStore(store => store.userProfile);
    const currentProfileKey = useProfileStore(store => store.currentProfileKey);
    const setUserProfile = useProfileStore(store => store.setUserProfile);

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
        setTotalWeight(restaurants.reduce((sum, restaurant) => sum + restaurant.weight, 0));
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
            onConfirm: () => { 
                setRestaurants(restaurants.filter((rs) => rs.name !== name));
                setIsOpen(false);
            },
            showButtons: true
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
        if (!totalWeight) {
            setChoice("Nothing!");
            return;
        }

        let random = Math.random() * totalWeight;
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

    const getWeightedOddsFormatted = (restaurant: Restaurant) => {
        const odds = Math.round((restaurant.weight * 100) / totalWeight);
        return `${restaurant.name} ~${odds}%`
    }

    return (
        <>
            <div className="random-choice-section">
                <h1>
                    <strong onClick={calculateRandomChoice}>{choice ? choice + "! Try again?" : "Click to get a random choice!"}</strong>
                </h1>
            </div>
            <div className="container">
                <div className="weights-header" onClick={() => setRestaurantWeightsExpanded(!restaurantWeightsExpanded)}>
                    <h3>Manage Restaurants & Weights for <span className='underline'>{userProfile[currentProfileKey].name}</span></h3>
                    <div className={`toggle-icon ${restaurantWeightsExpanded ? 'expanded' : ''}`}>
                        ▼
                    </div>
                </div>
                <p>{!restaurantWeightsExpanded && `Rough odds: ${restaurants.map(getWeightedOddsFormatted).join(', ')}`}</p>

                <div className={`weights-content ${restaurantWeightsExpanded ? 'expanded' : ''}`}>
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
                    <button onClick={handleResetWeight}>Reset Weights</button>
                </div>
            </div>
        </>
    );
}

export default Restaurants;