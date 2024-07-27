import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./fclConfig";

import Admin from "./components/Admin";
import MyTiles from "./components/MyTiles";
import Mosaic from "./components/Mosaic";

const adminAddress = "0xdbf7a2a1821c9ffa"; // Replace with your actual admin address

function App() {
  const [user, setUser] = useState({ loggedIn: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <nav className="p-4 flex justify-between items-center bg-gray-800">
          <button
            onClick={toggleMenu}
            className="px-4 py-2 bg-gray-700 text-gray-300 hover:text-white rounded focus:outline-none"
          >
            ☰
          </button>
          <Link to="/" className="text-4xl font-bold hover:underline">
            Mosaic
          </Link>
          <div className="flex items-center space-x-4">
            {user.loggedIn ? (
              <>
                <div className="text-right">
                  <p>{user.addr}</p>
                  <p>Mainnet</p>
                  <p>{user.addr === adminAddress ? "Admin" : "User"}</p>
                </div>
                <button
                  onClick={logOut}
                  className="px-4 py-2 bg-red-500 text-white hover:text-gray-300 rounded focus:outline-none"
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

        {isMenuOpen && (
          <div className="bg-gray-700 p-4 rounded shadow-lg">
            <Link
              to="/"
              className="block w-full px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none text-center mb-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {user.loggedIn && (
              <>
                <Link
                  to="/my-tiles"
                  className="block w-full px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none text-center mb-2"
                  onClick={toggleMenu}
                >
                  My Tiles
                </Link>
                {user.addr === adminAddress && (
                  <Link
                    to="/admin"
                    className="block w-full px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none text-center"
                    onClick={toggleMenu}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-tiles" element={<MyTiles />} />
          <Route path="/" element={<Mosaic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
