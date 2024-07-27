import React, { useEffect, useState } from "react";
import { getMosaicDetails, getBatchNFTDetails } from "../getMosaicDetails";

function Mosaic() {
  const [mosaicDetails, setMosaicDetails] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMosaicDetails = async () => {
      const details = await getMosaicDetails(0); // Assuming mosaicID 0
      setMosaicDetails(details);
    };

    fetchMosaicDetails();
  }, []);

  useEffect(() => {
    if (mosaicDetails && mosaicDetails.size) {
      const fetchTileDetails = async () => {
        setLoading(true);
        const tileDetails = Array(mosaicDetails.size).fill(null);

        try {
          const ids = Array.from({ length: mosaicDetails.size }, (_, i) => i);
          const details = await getBatchNFTDetails(ids);

          ids.forEach((id) => {
            if (details[id]) {
              tileDetails[id] = details[id];
            } else {
              tileDetails[id] = {
                id,
                description: "N/A",
                ownerAddress: "N/A",
                collectionPath: "N/A",
                collectionCapabilityPath: "N/A",
              };
            }
          });
        } catch (error) {
          console.error("Failed to fetch tile details:", error);
        }

        setTiles(tileDetails);
        setLoading(false);
      };

      fetchTileDetails();
    }
  }, [mosaicDetails]);

  if (!mosaicDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Mosaic</h2>
      <p>Mosaic ID: {mosaicDetails.mosaicID}</p>
      <p>Collection: {mosaicDetails.collection}</p>
      <p>Size: {mosaicDetails.size}</p>
      <p>Locked: {mosaicDetails.locked.toString()}</p>
      <div className="grid grid-cols-10 gap-2 mt-4">
        {loading ? (
          <div>Loading tiles...</div>
        ) : (
          tiles.map((tile, index) => (
            <div key={index} className="border border-gray-500 p-2 text-center">
              {tile ? (
                <>
                  <p>ID: {tile.id}</p>
                  <p>Description: {tile.description}</p>
                  <p>Owner Address: {tile.ownerAddress}</p>
                  <p>Collection Path: {tile.collectionPath}</p>
                  <p>
                    Collection Capability Path: {tile.collectionCapabilityPath}
                  </p>
                </>
              ) : (
                <p>{index}: N/A</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Mosaic;
