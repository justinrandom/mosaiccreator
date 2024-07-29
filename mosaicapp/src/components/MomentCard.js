// src/components/MomentCard.js
import React from "react";

const MomentCard = ({ moment, onSelect, isClickable, style }) => (
  <div
    className={`p-4 ${isClickable ? "cursor-pointer" : ""}`}
    onClick={() => isClickable && onSelect(moment.id.toString())}
    style={style}
  >
    <img
      src={`https://assets.nbatopshot.com/media/${moment.id}?width=256`}
      alt={`Moment ${moment.id}`}
      className="w-full h-full object-cover"
    />
    <p className="mt-2 text-xs">ID: {moment.id}</p>
  </div>
);

export default MomentCard;
