import React from "react";
import { NavLink } from "react-router-dom";

function NavigationMenu({ isMenuOpen, toggleMenu, user, adminAddress }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gray-800 z-50 transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <button
        onClick={toggleMenu}
        className="px-4 py-2 text-gray-300 hover:text-white focus:outline-none"
      >
        ☰
      </button>
      <div className="flex flex-col p-4">
        <NavLink
          to="/"
          className="block w-full px-4 py-2 text-white hover:text-gray-300 rounded focus:outline-none mb-2"
          onClick={toggleMenu}
        >
          Home
        </NavLink>
        {user.loggedIn && (
          <>
            <NavLink
              to="/my-tiles"
              className="block w-full px-4 py-2 text-white hover:text-gray-300 rounded focus:outline-none mb-2"
              onClick={toggleMenu}
            >
              My Tiles
            </NavLink>
            {user.addr === adminAddress && (
              <NavLink
                to="/admin"
                className="block w-full px-4 py-2 text-white hover:text-gray-300 rounded focus:outline-none mb-2"
                onClick={toggleMenu}
              >
                Admin
              </NavLink>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NavigationMenu;
