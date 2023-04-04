import { useState } from "react";
import "./App.css";

function App() {
    const [choice, setChoice] = useState("");
    const [restaurants, setRestaurants] = useState([
        { name: "Hotbox", weight: 0.5 },
        { name: "Paramount", weight: 0.5 },
        { name: "Marty's GM", weight: 0.5 },
        { name: "Marty's PM", weight: 0.5 },
        { name: "Saw's", weight: 0.5 },
        { name: "Jack Brown's", weight: 0.5 },
        { name: "Eugene's", weight: 0.5 },
        { name: "Hattie B's", weight: 0.5 },
        { name: "Giuseppe's", weight: 0.5 },
        { name: "Al's Deli", weight: 0.5 },
        { name: "Eli's", weight: 0.5 },
        { name: "Makario's", weight: 0.5 },
        { name: "Surin", weight: 0.5 },
        { name: "Back 40", weight: 0.5 },
        { name: "Rojo", weight: 0.5 }
    ]);

    const handleAdjustWeights = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temp = Array.from(restaurants);
        const index = temp.findIndex(rs => rs.name === e.target.name);
        temp[index].weight = e.target.valueAsNumber;
        setRestaurants(temp);
    };

    const calculateRandomChoice = () => {
        const allChoices = restaurants.map(rs => new Array(Math.round(rs.weight * 20)).fill(rs.name)).flat();
        const randomChoice = allChoices[Math.floor(Math.random() * allChoices.length)];
        setChoice(randomChoice);
    };

    return (
        <div className="App">
            <button onClick={calculateRandomChoice}>
                {!choice ? (
                    "Get a random choice!"
                ) : (
                    <span>
                        <strong>{choice}</strong>. Choose again?
                    </span>
                )}
            </button>

            {restaurants.map((rs, i) => (
                <div key={`restaurant-div-${i}`}>
                    <label>{rs.name}</label>
                    <input onChange={handleAdjustWeights} name={rs.name} type="range" step={0.05} value={rs.weight} max={1} />
                </div>
            ))}
        </div>
    );
}

export default App;
