// src/components/TileCard.js
import React from "react";

const TileCard = ({ tile, onSelect, isClickable, style }) => (
  <div
    className={`p-4 ${isClickable ? "cursor-pointer" : ""}`}
    onClick={() => isClickable && onSelect(tile.id.toString())}
    style={style}
  >
    {tile.collectionCapabilityPath !== "N/A" ? (
      <img
        src={`https://assets.nbatopshot.com/media/${tile.collectionCapabilityPath}?width=256`}
        alt={`Tile ${tile.id}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='white'/%3E%3C/svg%3E";
        }}
      />
    ) : (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span className="text-gray-400 text-4xl">?</span>
      </div>
    )}
    <p className="mt-2 text-xs">ID: {tile.id}</p>
  </div>
);

export default TileCard;
