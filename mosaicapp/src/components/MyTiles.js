import React, { useState, useEffect } from "react";
import { fetchTopShotMoments } from "../flow/scripts";
import { updateTileData } from "../flow/transactions";
import ViewTile from "./ViewTile"; // Import ViewTile component
import * as fcl from "@onflow/fcl";

function MyTiles() {
  const [tileID, setTileID] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [topShotMoments, setTopShotMoments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  useEffect(() => {
    const fetchMoments = async () => {
      if (user && user.addr) {
        const moments = await fetchTopShotMoments(user.addr);
        const formattedMoments = Object.values(moments).map(
          (item) => item[Object.keys(item)[0]]
        );
        setTopShotMoments(formattedMoments);
      }
    };
    fetchMoments();
  }, [user]);

  const handleUpdateTileData = async () => {
    await updateTileData(parseInt(tileID), newDescription);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Tiles</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Update Tile Data</h3>
        <input
          type="text"
          placeholder="Tile ID (UInt64)"
          value={tileID}
          onChange={(e) => setTileID(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="New Description (String)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleUpdateTileData}
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Update Tile Data
        </button>
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

      {/* Add ViewTile component here */}
      <ViewTile />
    </div>
  );
}

export default MyTiles;
