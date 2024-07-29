import React, { useState } from "react";
import { getSingleNFTDetail } from "../flow/scripts";

function ViewTile() {
  const [tileID, setTileID] = useState("");
  const [tileDetails, setTileDetails] = useState(null);

  const handleViewTile = async () => {
    const details = await getSingleNFTDetail(parseInt(tileID));
    setTileDetails(details);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">View Tile</h2>
      <input
        type="text"
        placeholder="Tile ID (UInt64)"
        value={tileID}
        onChange={(e) => setTileID(e.target.value)}
        className="text-black p-2 mb-2 rounded w-full"
      />
      <button
        onClick={handleViewTile}
        className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
      >
        View Tile
      </button>

      {tileDetails && (
        <div className="mt-4">
          <p>ID: {tileDetails.id}</p>
          <p>Description: {tileDetails.description}</p>
          <p>Owner Address: {tileDetails.ownerAddress}</p>
          <p>Collection Path: {tileDetails.collectionPath}</p>
          <p>
            Collection Capability Path: {tileDetails.collectionCapabilityPath}
          </p>
        </div>
      )}
    </div>
  );
}

export default ViewTile;
