import Modal from "./components/Modal";
import Profile from "./components/Profile";
import Restaurants from "./components/Restaurants";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
    return (
        <main>
            <Modal />
            <Restaurants />
            <Profile />
            <Footer />
        </main>
    );
};

export default App;
