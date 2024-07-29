import React, { useState } from "react";
import { updateMetadata } from "../../../archive/updateMetadata";

function User() {
  const [nftID, setNftID] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [newCollectionPath, setNewCollectionPath] = useState("");
  const [newCollectionCapabilityPath, setNewCollectionCapabilityPath] =
    useState("");

  const handleUpdateMetadata = async () => {
    await updateMetadata(
      nftID,
      newOwnerAddress,
      newCollectionPath,
      newCollectionCapabilityPath
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">User Section</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Update Tile Data</h3>
        <label className="block">
          Tile ID (UInt64):
          <input
            type="number"
            value={nftID}
            onChange={(e) => setNftID(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <label className="block mt-2">
          New Owner Address (Address):
          <input
            type="text"
            value={newOwnerAddress}
            onChange={(e) => setNewOwnerAddress(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <label className="block mt-2">
          New Collection Path (String):
          <input
            type="text"
            value={newCollectionPath}
            onChange={(e) => setNewCollectionPath(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <label className="block mt-2">
          New Collection Capability Path (String):
          <input
            type="text"
            value={newCollectionCapabilityPath}
            onChange={(e) => setNewCollectionCapabilityPath(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </label>
        <button
          onClick={handleUpdateMetadata}
          className="mt-2 px-4 py-2 bg-blue-500 text-gray-300 hover:text-white rounded focus:outline-none"
        >
          Update Tile Data
        </button>
      </div>
    </div>
  );
}

export default User;
