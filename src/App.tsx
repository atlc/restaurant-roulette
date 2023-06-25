import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "restaurants";

interface Restaurant {
    name: string;
    weight: number;
}

const MAX_LENGTH = 20;
const INITIAL_STATE = [
    { name: "Hotbox", weight: 0.5 },
    { name: "Paramount", weight: 0.5 },
    { name: "Eugene's", weight: 0.5 },
    { name: "Marty's PM", weight: 0.5 },
    { name: "Makarios", weight: 0.5 },
    { name: "Saw's", weight: 0.5 },
    { name: "Red Pearl", weight: 0.5 },
    { name: "El Barrio", weight: 0.5 },
    { name: "Giuseppe's", weight: 0.5 },
    { name: "Rougaroux", weight: 0.5 },
];

const App = () => {
    const [choice, setChoice] = useState("");
    const [newName, setNewName] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const store = localStorage.getItem(STORAGE_KEY);

        if (store) {
            setRestaurants(JSON.parse(store));
        } else {
            setRestaurants(INITIAL_STATE);
        }
    }, []);

    useEffect(() => {
        if (!restaurants.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
            setRestaurants(INITIAL_STATE);
            return;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    }, [restaurants]);

    const handleAddRestaurant = () => {
        if (!newName) return;
        setRestaurants([...restaurants, { name: newName.substring(0, MAX_LENGTH), weight: 0.5 }]);
        setNewName("");
    };

    const handleRemoveRestaurant = (name: string) => {
        setRestaurants(restaurants.filter((rs) => rs.name !== name));
    };

    const handleAdjustWeights = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temp = Array.from(restaurants);
        const index = temp.findIndex((rs) => rs.name === e.target.name);
        temp[index].weight = e.target.valueAsNumber;
        setRestaurants(temp);
    };

    const handleReset = () => {
        setRestaurants(restaurants.map((rs) => ({ ...rs, weight: 0.5 })));
    };

    const calculateRandomChoice = () => {
        const allChoices = restaurants.map((rs) => new Array(Math.round(rs.weight * 20)).fill(rs.name)).flat();
        const randomChoice = allChoices[Math.floor(Math.random() * allChoices.length)];
        setChoice(randomChoice);
    };

    const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddRestaurant();
        }
    };

    return (
        <div className="App">
            <div>
                <button onClick={handleReset}>Reset weights</button>
                <button onClick={calculateRandomChoice}>{!choice ? "Random choice!" : "Try again?"}</button>
                <h1>
                    <strong>{choice}</strong>
                </h1>
            </div>

            <div>
                <input
                    placeholder="Add your restaurant here!"
                    onKeyDown={(e) => handleSubmitOnEnter(e)}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    type="text"
                    maxLength={MAX_LENGTH}
                />
                <span className="smol">
                    {newName.length}/{MAX_LENGTH}
                </span>
                <button style={{ color: "#00ff33" }} onClick={handleAddRestaurant}>
                    +1
                </button>
            </div>

            {restaurants.map((rs, i) => (
                <div className="row" key={`restaurant-div-${i}`}>
                    <div className="col-left">
                        <label>{rs.name}</label>
                    </div>
                    <div className="col-right">
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
