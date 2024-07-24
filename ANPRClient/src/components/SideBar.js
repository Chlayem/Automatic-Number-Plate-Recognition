import {React , useState,useRef , useEffect} from 'react';
import DropUpMenu from './common/DropUpMenu';


const Sidebar = ({ openModal }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const sidebarRef = useRef(null); 

    console.log("sideBar");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setActiveMenu(null);  
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarRef]);

    const handleOptionSelect = (option) => {
        openModal(option.type,null,option.label,option.icon);
        setActiveMenu(null); 
    };

    const handleItemClick = (item) => {
        setActiveMenu(activeMenu === item ? null : item);

    };
    return (
        <div ref={sidebarRef} className="sidebar">
            <div className="sidebar-item" onClick={() => handleItemClick('configuration')}>
                Configuration
                {activeMenu === 'configuration' && <DropUpMenu options={['Caméras', 'Détecteurs']} onSelect={handleOptionSelect} category={'configuration'}/>}
            </div>
            <div className="sidebar-item" onClick={() => handleItemClick('serveur')}>
                Serveur
                {activeMenu === 'serveur' && <DropUpMenu options={['Paramètres', 'Utilisateurs','Info']} onSelect={handleOptionSelect} category={'serveur'}/>}
            </div>
            <div className="sidebar-item" onClick={() => handleItemClick('journal')}>
                Journal
                {activeMenu === 'journal' && <DropUpMenu options={['Evenements']} onSelect={handleOptionSelect} category={'journal'}/>}
            </div>
        </div>
    );
};

export default Sidebar;
