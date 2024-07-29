import React, { useState, useEffect } from "react";
import {
  createMosaic,
  mintTile,
  updateTileDescription,
  updateTileMetadata,
} from "../flow/transactions";
import { getMosaicDetails, getBatchNFTDetails } from "../flow/scripts"; // Ensure getMosaicDetails and getBatchNFTDetails are imported

function Admin() {
  const [mosaicCollection, setMosaicCollection] = useState("");
  const [mosaicSize, setMosaicSize] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [collectionPath, setCollectionPath] = useState("");
  const [collectionCapabilityPath, setCollectionCapabilityPath] = useState("");
  const [mosaicDetailsList, setMosaicDetailsList] = useState([]);
  const [tileDetailsList, setTileDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMosaicDetails = async () => {
      let id = 0;
      const mosaicDetails = [];

      while (true) {
        try {
          const details = await getMosaicDetails(id);
          if (details) {
            mosaicDetails.push(details);
            id++;
          } else {
            break;
          }
        } catch (error) {
          break; // Stop fetching when an error occurs (i.e., no more mosaics)
        }
      }

      setMosaicDetailsList(mosaicDetails);
    };

    fetchAllMosaicDetails();
  }, []);

  useEffect(() => {
    const fetchAllTileDetails = async () => {
      setLoading(true);
      const ids = Array.from({ length: 100 }, (_, i) => i); // Assuming a maximum of 100 tiles for simplicity
      const details = await getBatchNFTDetails(ids);
      setTileDetailsList(Object.values(details));
      setLoading(false);
    };

    fetchAllTileDetails();
  }, []);

  const handleCreateMosaic = async () => {
    await createMosaic(mosaicCollection, parseInt(mosaicSize));
  };

  const handleMintTile = async () => {
    await mintTile(nftDescription, collectionPath, collectionCapabilityPath);
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
        <h3 className="text-xl font-semibold mb-2">Mosaic Details</h3>
        {mosaicDetailsList.map((details, index) => (
          <div key={index} className="mt-4 p-4 bg-gray-800 rounded">
            <p>Mosaic ID: {details.mosaicID}</p>
            <p>Collection: {details.collection}</p>
            <p>Size: {details.size}</p>
            <p>Locked: {details.locked.toString()}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Tile Details</h3>
        {loading ? (
          <p>Loading tile details...</p>
        ) : (
          tileDetailsList.map((details, index) => (
            <div key={index} className="mt-4 p-4 bg-gray-800 rounded">
              <p>ID: {details.id}</p>
              <p>Description: {details.description}</p>
              <p>Owner Address: {details.ownerAddress}</p>
              <p>Collection Path: {details.collectionPath}</p>
              <p>
                Collection Capability Path: {details.collectionCapabilityPath}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
