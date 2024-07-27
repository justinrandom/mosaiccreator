import React, { useState } from "react";
import { updateTileData } from "../flow/transactions";
import ViewTile from "./ViewTile"; // Import ViewTile component

function MyTiles() {
  const [tileID, setTileID] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

      {/* Add ViewTile component here */}
      <ViewTile />
    </div>
  );
}

export default MyTiles;
