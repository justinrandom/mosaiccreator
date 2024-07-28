import React, { useState, useEffect } from "react";
import { fetchTopShotMoments, fetchUserTiles } from "../flow/scripts";
import {
  updateTileDescription,
  updateTileMetadata,
} from "../flow/transactions";
import * as fcl from "@onflow/fcl";

function UpdateTile() {
  const [selectedTile, setSelectedTile] = useState("");
  const [selectedMoment, setSelectedMoment] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [newCollectionPath, setNewCollectionPath] = useState("");
  const [newCollectionCapabilityPath, setNewCollectionCapabilityPath] =
    useState("");
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

  useEffect(() => {
    if (selectedTile && selectedMoment && user) {
      const moment = topShotMoments.find(
        (moment) => moment.id.toString() === selectedMoment
      );
      const tile = userTiles.find(
        (tile) => tile.id.toString() === selectedTile
      );

      if (moment && tile) {
        setNewOwnerAddress(user.addr);
        setNewCollectionPath("NBA Top Shot");
        setNewCollectionCapabilityPath(moment.id.toString());
      }
    }
  }, [selectedTile, selectedMoment, user, topShotMoments, userTiles]);

  const handleUpdateTileMetadata = async () => {
    await updateTileMetadata(
      parseInt(selectedTile),
      newOwnerAddress,
      newCollectionPath,
      newCollectionCapabilityPath
    );
  };

  const handleUpdateTileDescription = async () => {
    try {
      console.log(
        `Updating Tile ID: ${selectedTile} with Description: ${newDescription}`
      );
      const txId = await updateTileDescription(selectedTile, newDescription);
      console.log(`Transaction ID: ${txId}`);
      fcl
        .tx(txId)
        .onceSealed()
        .then(() => {
          console.log("Transaction sealed");
          alert("Tile description updated successfully!");
        });
    } catch (error) {
      console.error("Error updating tile description:", error);
      alert("Failed to update tile description.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Update Tile</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Select a Tile to Update</h3>
        <select
          value={selectedTile}
          onChange={(e) => setSelectedTile(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        >
          <option value="">Select Tile</option>
          {userTiles.map((tile) => (
            <option key={tile.id} value={tile.id}>
              Tile ID: {tile.id}, Description: {tile.description}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">
          Select an NBA Top Shot Moment
        </h3>
        <select
          value={selectedMoment}
          onChange={(e) => setSelectedMoment(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        >
          <option value="">Select Moment</option>
          {topShotMoments.map((moment) => (
            <option key={moment.id} value={moment.id}>
              Moment ID: {moment.id}, Play ID: {moment.playID}
            </option>
          ))}
        </select>
      </div>

      {selectedTile && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Selected Tile Details</h3>
          <div className="p-4 bg-gray-800 rounded">
            {userTiles
              .filter((tile) => tile.id.toString() === selectedTile)
              .map((tile) => (
                <div key={tile.id}>
                  <p>ID: {tile.id}</p>
                  <p>Description: {tile.description}</p>
                  <p>Owner Address: {tile.ownerAddress}</p>
                  <p>Collection Path: {tile.collectionPath}</p>
                  <p>
                    Collection Capability Path: {tile.collectionCapabilityPath}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedMoment && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            Selected Moment Details
          </h3>
          <div className="p-4 bg-gray-800 rounded">
            {topShotMoments
              .filter((moment) => moment.id.toString() === selectedMoment)
              .map((moment) => (
                <div key={moment.id}>
                  <p>ID: {moment.id}</p>
                  <p>Play ID: {moment.playID}</p>
                  <p>Set Name: {moment.setName}</p>
                  <p>Serial Number: {moment.serialNumber}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Update Tile Metadata</h3>
        <input
          type="text"
          placeholder="New Owner Address (Address)"
          value={newOwnerAddress}
          onChange={(e) => setNewOwnerAddress(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="New Collection Path (String)"
          value={newCollectionPath}
          onChange={(e) => setNewCollectionPath(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="New Collection Capability Path (String)"
          value={newCollectionCapabilityPath}
          onChange={(e) => setNewCollectionCapabilityPath(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleUpdateTileMetadata}
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Update Tile Metadata
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Update Tile Description</h3>
        <input
          type="text"
          placeholder="New Description (String)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="text-black p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleUpdateTileDescription}
          className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
        >
          Update Tile Description
        </button>
      </div>
    </div>
  );
}

export default UpdateTile;
