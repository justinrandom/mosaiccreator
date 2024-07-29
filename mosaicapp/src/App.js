import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Route, Routes } from "react-router-dom";
import "./fclConfig";

import Admin from "./components/Admin";
import MyTiles from "./components/MyTiles";
import Mosaic from "./components/Mosaic";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";
import UpdateTile from "./components/MyTiles"; // Import UpdateTile component

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
    <div className="bg-gray-900 text-white min-h-screen">
      <Header
        user={user}
        logIn={logIn}
        logOut={logOut}
        toggleMenu={toggleMenu}
      />
      <NavigationMenu
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        user={user}
        adminAddress={adminAddress}
      />
      <div
        className={`transition-opacity duration-300 ${
          isMenuOpen ? "opacity-50" : "opacity-100"
        }`}
      >
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-tiles" element={<MyTiles />} />
          <Route path="/update-tile" element={<UpdateTile />} />
          <Route path="/" element={<Mosaic />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
