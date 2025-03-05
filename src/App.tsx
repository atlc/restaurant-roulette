import { useEffect, useState } from "react";
import "./App.css";
import { INITIAL_STATE } from "./constants";
import { Restaurant } from "./types";
import { getRestaurants, saveRestaurants } from "./services/localStorage";


const App = () => {
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const store = getRestaurants();
        setRestaurants(store);
    }, []);

    useEffect(() => {
        if (!restaurants.length) {
            saveRestaurants(INITIAL_STATE);
            setRestaurants(INITIAL_STATE);
            return;
        }

        saveRestaurants(restaurants);
    }, [restaurants]);

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
        <div className="App">
            <div>
                <button onClick={handleResetWeight}>Reset weights</button>
                <button onClick={calculateRandomChoice}>{!choice ? "Random choice!" : "Try again?"}</button>
                <h1>
                    <strong>{choice}</strong>
                </h1>
            </div>

            {restaurants.map((rs, i) => (
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
    );
};

export default App;
