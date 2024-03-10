import { useState, useRef, useEffect } from "react";
import { Close, DarkMode, LightMode, Menu } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';

const Header = () => {
    const [menu, setMenu] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    const { darkMode, toggleTheme } = useTheme();


    const getmLinkClass = (path) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + "/");

        return darkMode ? (isActive ? "text-white bg-[#1f1f1f] shadow cursor-pointer rounded-lg p-2 w-[13rem]" : "pl-2 text-white") : (isActive ? "text-gray-800 bg-[#f1f3f4] shadow cursor-pointer rounded-lg p-2 w-[13rem]" : "pl-2 text-gray-800");
    };

    const getlLinkClass = (path) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
        return darkMode ? (isActive ? "text-white" : "text-gray-400") : (isActive ? "text-gray-800" : "text-gray-400");
    };


    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenu(false);
        }
    };

    const { logout } = useAuthContext();

    const handleSignout = () => {
        logout();
        sessionStorage.removeItem('welcomeShown');
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menu]);


    return (
        <div className={`flex fixed justify-center w-full lg:h-[4.3rem] h-[3.9rem] z-10 ${darkMode ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
            <nav data-aos="fade" className={`flex justify-between lg:w-10/12 lg:pr-10 md:pr-10 p-4 items-center fixed  ${darkMode ? 'bg-[#1f1f1f] text-white' : 'bg-white'}`}>
                <div className="flex items-center cursor-pointer">
                    <img className="lg:w-[13%] w-[22%] mr-1" src="https://i.imgur.com/i6EadBg.png" alt="Advisoropedia" />
                </div>
                <div className="flex items-center space-x-10 md:w-6/12 lg:w-fit">

                    <span className="space-x-10 hidden lg:flex md:flex">
                        <Link className={`${getlLinkClass("/")}`} to="/">
                            Movies
                        </Link>
                        <Link className={`${getlLinkClass()}`} onClick={handleSignout}>
                            Sign out
                        </Link>
                    </span>

                    <span className="cursor-pointer mr-5 md:hidden lg:hidden" onClick={toggleTheme}>
                        {darkMode ? <DarkMode sx={{ fontSize: 27 }} /> : <LightMode sx={{ fontSize: 27 }} />}
                    </span>

                    <div className="hidden lg:flex md:flex space-x-7 mr-4 items-center">
                        <span className="cursor-pointer" onClick={toggleTheme}>
                            {darkMode ? <DarkMode sx={{ fontSize: 27 }} /> : <LightMode sx={{ fontSize: 27 }} />}
                        </span>
                        <img className="w-9 cursor-pointer" src="https://i.imgur.com/izjKYfy.png" alt="Profile" />

                    </div>
                    <span className="lg:hidden md:hidden" onClick={() => setMenu(true)}>
                        {menu ? <Close sx={{ fontSize: 27 }} /> : <Menu sx={{ fontSize: 27 }} />}
                    </span>

                </div>

            </nav>

            <div
                ref={menuRef}
                className={`fixed md:hidden lg:hidden text-lg left-0 top-0 w-[70vw] z-10 h-full ${darkMode ? "bg-[#121212] text-white" : "bg-white text-gray-800"} duration-200 transform shadow ${menu ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <p className="border-b-2 p-6 pb-[.6rem]">Menu</p>
                <div className="flex flex-col p-4 pt-6 space-y-4">
                    <Link className={`${getmLinkClass("/")}`} onClick={() => setMenu(false)} to="/">
                        Movies
                    </Link>
                    <Link
                        className={`${getmLinkClass("/Resume")}`}
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Link>
                </div>
            </div >
        </div>
    );
};

export default Header;