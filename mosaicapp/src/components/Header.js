import React from "react";
import { NavLink } from "react-router-dom";
import * as fcl from "@onflow/fcl";
import Logo from "../FlowConnect.svg"; // Update with the actual path to the logo

function Header({ user, logIn, logOut, toggleMenu }) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <button
        onClick={toggleMenu}
        className="px-4 py-2 bg-gray-700 text-gray-300 hover:text-white rounded focus:outline-none"
      >
        ☰
      </button>
      <NavLink to="/" className="text-4xl font-bold hover:underline">
        <img src={Logo} alt="Nexus logo" className="h-14" />
      </NavLink>
      <div className="flex items-center space-x-4">
        {user.loggedIn ? (
          <>
            <div className="text-right">
              <p>{user.addr}</p>
              <p>Mainnet</p>
            </div>
            <button
              onClick={logOut}
              className="px-4 py-2 bg-purple-800 text-white hover:text-gray-300 rounded focus:outline-none"
            >
              Log Out
            </button>
          </>
        ) : (
          <button
            onClick={logIn}
            className="px-4 py-2 bg-green-500 text-white hover:text-gray-300 rounded focus:outline-none"
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
