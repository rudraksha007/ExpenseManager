import { FaTimes } from "react-icons/fa";

function Popup({ children, isLarge, reset, title }) {
    return (
        <div className="popup">
            <div className="popupCont" id={isLarge ? 'largerPopupCont' : ''}>
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => reset()} />
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default Popup;