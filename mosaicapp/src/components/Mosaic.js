import React, { useEffect, useState } from "react";
import { getMosaicDetails, getBatchNFTDetails } from "../flow/scripts";
import Draggable from "react-draggable";
import { FaPlus, FaMinus } from "react-icons/fa";

function Mosaic() {
  const [mosaicDetails, setMosaicDetails] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTile, setSelectedTile] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

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
            const x = id % 10;
            const y = Math.floor(id / 10);
            if (details[id]) {
              tileDetails[id] = { ...details[id], x, y };
            } else {
              tileDetails[id] = {
                id,
                description: "N/A",
                ownerAddress: "N/A",
                collectionPath: "N/A",
                collectionCapabilityPath: "N/A",
                x,
                y,
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

  const handleZoom = (zoomIn) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale + 0.5 : prevScale - 0.5;
      return newScale < 1 ? 1 : newScale > 3 ? 3 : newScale;
    });
  };

  const handleTileClick = (tile) => {
    if (!isDragging) {
      setSelectedTile(tile);
    }
  };

  const closeModal = () => {
    setSelectedTile(null);
  };

  const handleStart = () => {
    setIsDragging(false);
  };

  const handleDrag = () => {
    setIsDragging(true);
  };

  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    setTimeout(() => setIsDragging(false), 100); // Reset the flag after a short delay
  };

  if (!mosaicDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Mosaic</h2>
      <div
        className="relative border-4 border-gray-700 bg-white overflow-hidden"
        style={{ height: "640px", width: "100%", maxWidth: "1280px" }}
      >
        <Draggable
          position={position}
          onStart={handleStart}
          onDrag={handleDrag}
          onStop={handleStop}
          scale={scale}
        >
          <div
            className="grid grid-cols-10 gap-0"
            style={{
              width: `${640 * scale}px`,
              height: `${640 * scale}px`,
              transformOrigin: "center center",
            }}
          >
            {loading ? (
              <div>Loading tiles...</div>
            ) : (
              tiles.map((tile, index) => (
                <div
                  key={index}
                  className="border border-gray-400"
                  onClick={() => handleTileClick(tile)}
                  style={{
                    width: `${64 * scale}px`,
                    height: `${64 * scale}px`,
                  }}
                >
                  {tile.collectionCapabilityPath !== "N/A" ? (
                    <img
                      src={`https://assets.nbatopshot.com/media/${tile.collectionCapabilityPath}?width=256`}
                      alt={`Tile ${tile.id}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='white'/%3E%3C/svg%3E";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </Draggable>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            onClick={() => handleZoom(false)}
            disabled={scale <= 1}
            className="px-4 py-2 bg-gray-700 text-white rounded focus:outline-none disabled:opacity-50"
          >
            <FaMinus />
          </button>
          <button
            onClick={() => handleZoom(true)}
            disabled={scale >= 3}
            className="px-4 py-2 bg-gray-700 text-white rounded focus:outline-none disabled:opacity-50"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {selectedTile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-md text-black relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Tile Details</h3>
            <p>ID: {selectedTile.id}</p>
            <p>Description: {selectedTile.description}</p>
            <p>Owner Address: {selectedTile.ownerAddress}</p>
            <p>Collection Path: {selectedTile.collectionPath}</p>
            <p>
              Collection Capability Path:{" "}
              {selectedTile.collectionCapabilityPath}
            </p>
            <p>
              Coordinates: ({selectedTile.x}, {selectedTile.y})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mosaic;
