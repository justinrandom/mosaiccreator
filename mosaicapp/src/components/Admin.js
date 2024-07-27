import React, { useState } from "react";
import { createMosaic, mintTile, updateTileData } from "../flow/transactions";

function Admin() {
  const [mosaicCollection, setMosaicCollection] = useState("");
  const [mosaicSize, setMosaicSize] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [collectionPath, setCollectionPath] = useState("");
  const [collectionCapabilityPath, setCollectionCapabilityPath] = useState("");
  const [updateTileID, setUpdateTileID] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateMosaic = async () => {
    await createMosaic(mosaicCollection, parseInt(mosaicSize));
  };

  const handleMintTile = async () => {
    await mintTile(nftDescription, collectionPath, collectionCapabilityPath);
  };

  const handleUpdateTileData = async () => {
    await updateTileData(parseInt(updateTileID), newDescription);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Section</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Create Mosaic</h3>
        <input
          type="text"
          placeholder="Mosaic Collection (String)"
          value={mosaicCollection}
          onChange={(e) => setMosaicCollection(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Mosaic Size (UInt64)"
          value={mosaicSize}
          onChange={(e) => setMosaicSize(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleCreateMosaic}
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Create Mosaic
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Mint Tile</h3>
        <input
          type="text"
          placeholder="Description (String)"
          value={nftDescription}
          onChange={(e) => setNftDescription(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Collection Path (String)"
          value={collectionPath}
          onChange={(e) => setCollectionPath(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Collection Capability Path (String)"
          value={collectionCapabilityPath}
          onChange={(e) => setCollectionCapabilityPath(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleMintTile}
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Mint Tile
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Update Tile Data</h3>
        <input
          type="text"
          placeholder="Tile ID (UInt64)"
          value={updateTileID}
          onChange={(e) => setUpdateTileID(e.target.value)}
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
    </div>
  );
}

export default Admin;
