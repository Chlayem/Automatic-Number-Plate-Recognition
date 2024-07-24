
import { RiRestartLine,RiShutDownLine,RiSpeedUpLine   } from "react-icons/ri";
import { MdOutlineWindow } from "react-icons/md";

const Navbar = ({toggleDetections}) => {
    
    return(
        <nav className="navbar" >
            <div className="navbar-logo">
                <img src="vision_8.ico" alt="Enterprise Logo" />
                <span>Smartvisor VISION</span>
            </div>
            <div className="navbar-info">
                <div className="vertical-line"></div>
                <RiSpeedUpLine className="navbar-icons" />
                <span>20 FPS</span>
                <div className="vertical-line"></div>
                <span>Smartvisor</span>
            </div>
            <div className="navbar-controls">
                <button  className="navbar-icon-button">
                    <RiRestartLine className="navbar-icons" />
                    <span className="tooltip">Redémarrer</span>
                </button>
                <button  className="navbar-icon-button">
                    <RiShutDownLine className="navbar-icons" />
                    <span className="tooltip">Arrêter</span>
                </button>
                <button className="navbar-icon-button"  onClick={toggleDetections}>
                    <MdOutlineWindow className="navbar-icons" />
                    <span className="tooltip">Window</span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;