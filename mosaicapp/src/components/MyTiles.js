// src/components/MyTiles.js
import React, { useState, useEffect } from "react";
import { fetchTopShotMoments, fetchUserTiles } from "../flow/scripts";
import { Link } from "react-router-dom";
import * as fcl from "@onflow/fcl";

function MyTiles() {
  const [topShotMoments, setTopShotMoments] = useState([]);
  const [userTiles, setUserTiles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.addr) {
        const moments = await fetchTopShotMoments(user.addr);
        const formattedMoments = Object.values(moments).map(
          (item) => item[Object.keys(item)[0]]
        );
        setTopShotMoments(formattedMoments);

        const tiles = await fetchUserTiles(user.addr);
        const formattedTiles = Object.values(tiles).map(
          (item) => item[Object.keys(item)[0]]
        );
        setUserTiles(formattedTiles);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Tiles</h2>

      <div className="mb-4">
        <Link
          to="/update-tile"
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Update a Tile
        </Link>
      </div>

      <h3 className="text-xl font-semibold mb-2">My NBA Top Shot Moments</h3>
      <div className="grid grid-cols-1 gap-4">
        {topShotMoments.map((moment) => (
          <div key={moment.id} className="p-4 bg-gray-800 rounded">
            <p>ID: {moment.id}</p>
            <p>Play ID: {moment.playID}</p>
            <p>Set Name: {moment.setName}</p>
            <p>Serial Number: {moment.serialNumber}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-2">My Tiles</h3>
      <div className="grid grid-cols-1 gap-4">
        {userTiles.map((tile) => (
          <div key={tile.id} className="p-4 bg-gray-800 rounded">
            <p>ID: {tile.id}</p>
            <p>Description: {tile.description}</p>
            <p>Owner Address: {tile.ownerAddress}</p>
            <p>Collection Path: {tile.collectionPath}</p>
            <p>Collection Capability Path: {tile.collectionCapabilityPath}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTiles;
