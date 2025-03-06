import { useModalStore } from "../store";

const Footer = () => {
    const launchModal = useModalStore(store => store.launch);

    const showPrivacyPolicy = () => {
        launchModal({
            title: "Privacy Policy",
            message: "Your data is not collected or shared with or by anyone. No cookies or tracking are used. All data is stored only locally, only in your browser.",
            showButtons: false
        })
    }

    return (
        <div className="footer">
            <p>Made with ❤️ by <a className="text-green" href="https://github.com/atlc/restaurant-roulette">Cartwright</a></p>
            <p className="text-green" onClick={showPrivacyPolicy}>Privacy Policy</p>
        </div>
    );
}

export default Footer;