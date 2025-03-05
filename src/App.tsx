import { useEffect, useState } from "react";
import "./App.css";
import { Restaurant, RestaurantProfile, UserProfile } from "./types";
import { getUserProfile } from "./services/localStorage";
import { DEFAULT_USER_PROFILE } from "./constants/restaurants";


const App = () => {
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
    const [currentProfileKey, setCurrentProfileKey] = useState<string>("keysys");

    
    useEffect(() => {
        const profile = getUserProfile();
        setUserProfile(profile);
    }, []);

    useEffect(() => {
        if (!restaurants.length) {
            setRestaurants(userProfile[currentProfileKey].restaurants);
            return;
        }
    }, [restaurants]);

    useEffect(() => {
        setRestaurants(userProfile[currentProfileKey].restaurants);
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
        if (weight === 0) return "Not considered";
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

    return (
        <main>
            <div>
                <button onClick={handleResetWeight}>Reset weights</button>
                <button onClick={calculateRandomChoice}>{!choice ? "Random choice!" : "Try again?"}</button>
                <h1>
                    <strong>{choice}</strong>
                </h1>
            </div>

            <div className="row">
                <h2>Profile: {currentProfileKey}</h2>
                <h3>Profile list</h3>
                <ul>
                    {Object.keys(userProfile).map((key) => (
                        <li onClick={() => setCurrentProfileKey(key)} key={key}>{key}</li>
                    ))}
                </ul>
            </div>

            <div className="container">
                {userProfile[currentProfileKey].restaurants.map((rs, i) => (
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
                                className="center-vert"
                                onClick={() => handleRemoveRestaurant(rs.name)}
                                style={{ color: "red", fontSize: "1.25rem" }}
                            >
                                X
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default App;
