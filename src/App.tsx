import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = 'restaurants';

interface Restaurant {
    name: string;
    weight: number;
}

function App() {
    const [choice, setChoice] = useState("");
    const [newName, setNewName] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const store = localStorage.getItem(STORAGE_KEY);

        if (store) {
            setRestaurants(JSON.parse(store));
        } else {
            setRestaurants([
                { name: "Hotbox", weight: 0.5 },
                { name: "Paramount", weight: 0.5 },
                { name: "Marty's PM", weight: 0.5 },
                { name: "Saw's", weight: 0.5 },
                { name: "Jack Brown's", weight: 0.5 },
                { name: "Eugene's", weight: 0.5 },
                { name: "Hattie B's", weight: 0.5 },
                { name: "Giuseppe's", weight: 0.5 }
            ]);
        }
    }, []);

    useEffect(() => {
        if (!restaurants.length) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    }, [restaurants]);

    const handleAddRestaurant = () => {
        if (!newName) return;
        setRestaurants([...restaurants, { name: newName, weight: 0.5 }]);
        setNewName("");
    };

    const handleRemoveRestaurant = (name: string) => {
        setRestaurants(restaurants.filter(rs => rs.name !== name));
    };

    const handleAdjustWeights = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temp = Array.from(restaurants);
        const index = temp.findIndex(rs => rs.name === e.target.name);
        temp[index].weight = e.target.valueAsNumber;
        setRestaurants(temp);
    };

    const handleReset = () => {
        setRestaurants(restaurants.map(rs => ({ ...rs, weight: 0.5 })));
    };

    const calculateRandomChoice = () => {
        const allChoices = restaurants.map(rs => new Array(Math.round(rs.weight * 20)).fill(rs.name)).flat();
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
                <button onClick={handleReset}>Reset</button>
                <button onClick={calculateRandomChoice}>
                    {!choice ? (
                        "Random choice!"
                    ) : (
                        <span>
                            <strong>{choice}</strong>. Choose again?
                        </span>
                    )}
                </button>
            </div>

            <div>
                <input placeholder="Add your restaurant here!" onKeyDown={e => handleSubmitOnEnter(e)} value={newName} onChange={e => setNewName(e.target.value)} type="text" />
                <button style={{ color: "#00ff33" }} onClick={handleAddRestaurant}>+1</button>
            </div>

            {restaurants.map((rs, i) => (
                <div key={`restaurant-div-${i}`}>
                    <label className="center-vert">{rs.name}</label>
                    <input className="center-vert" onChange={handleAdjustWeights} name={rs.name} type="range" step={0.05} value={rs.weight} max={1} />
                    <span className="center-vert" onClick={() => handleRemoveRestaurant(rs.name)} style={{ color: "red", fontSize: "1.25rem" }}>X</span>
                </div>
            ))}
        </div>
    );
}

export default App;
