import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData, setUserData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Prescripto Logo"
      />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className="hover:text-primary">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors" className="hover:text-primary">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className="hover:text-primary">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary">
          <li className="py-1">CONTACT</li>
        </NavLink>

        {/* Admin Panel Button */}
        <li>
          <a
            href="https://doctor-appointment-booking-system-admin-tt0h.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs border border-gray-300 py-2 px-4 rounded-full hover:bg-primary hover:text-white transition"
          >
            Admin Panel
          </a>
        </li>
      </ul>

      {/* Right Side (User + Login) */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          // User Dropdown
          <div className="flex items-center cursor-pointer group relative gap-2">
            <img
              className="w-8 h-8 rounded-full"
              src={userData.image}
              alt="User"
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="Dropdown Icon"
            />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer text-red-500"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary px-6 py-2 md:px-8 md:py-3 rounded-full font-light text-white text-sm md:text-base"
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu Icon"
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full h-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex justify-between items-center px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close Menu"
            />
          </div>

          <ul className="flex flex-col items-center gap-3 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>

            {/* Admin Panel Button (Mobile) */}
            <li>
              <a
                href="https://doctor-appointment-booking-system-admin-tt0h.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-gray-300 py-2 px-4 rounded-full hover:bg-primary hover:text-white transition"
              >
                Admin Panel
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
