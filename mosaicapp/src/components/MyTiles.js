import React, { useState, useEffect } from "react";
import { fetchTopShotMoments, fetchUserTiles } from "../flow/scripts";
import { updateTileMetadata } from "../flow/transactions";
import * as fcl from "@onflow/fcl";
import TileCard from "./TileCard";
import MomentCard from "./MomentCard";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 6;
const CARD_SIZE = { width: "128px", height: "128px" };

function MyTiles() {
  const [selectedTile, setSelectedTile] = useState("");
  const [selectedMoment, setSelectedMoment] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [newCollectionPath, setNewCollectionPath] = useState("");
  const [newCollectionCapabilityPath, setNewCollectionCapabilityPath] =
    useState("");
  const [topShotMoments, setTopShotMoments] = useState([]);
  const [userTiles, setUserTiles] = useState([]);
  const [user, setUser] = useState(null);
  const [currentPageTiles, setCurrentPageTiles] = useState(1);
  const [currentPageMoments, setCurrentPageMoments] = useState(1);

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
        setUserTiles(formattedTiles.sort((a, b) => a.id - b.id));
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

  const handleUpdateTile = async () => {
    await handleUpdateTileMetadata();
  };

  const handlePageChangeTiles = (pageNumber) => {
    setCurrentPageTiles(pageNumber);
  };

  const handlePageChangeMoments = (pageNumber) => {
    setCurrentPageMoments(pageNumber);
  };

  const paginatedTiles = userTiles.slice(
    (currentPageTiles - 1) * ITEMS_PER_PAGE,
    currentPageTiles * ITEMS_PER_PAGE
  );

  const paginatedMoments = topShotMoments.slice(
    (currentPageMoments - 1) * ITEMS_PER_PAGE,
    currentPageMoments * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      <div className="mb-8 p-4 bg-gray-900 border-2 border-gray-400 rounded">
        <h2 className="text-2xl font-semibold mb-4">Mosaic Portal</h2>
        <div className="flex flex-row justify-between items-end mb-4">
          <div className="w-full lg:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">Selected Tile</h3>
            {selectedTile ? (
              <TileCard
                tile={userTiles.find(
                  (tile) => tile.id.toString() === selectedTile
                )}
                isClickable={false}
                style={CARD_SIZE}
              />
            ) : (
              <div
                className="p-4 bg-gray-800 rounded flex items-center justify-center"
                style={CARD_SIZE}
              >
                <span className="text-gray-400 text-4xl">?</span>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">
              Selected NBA Top Shot Moment
            </h3>
            {selectedMoment ? (
              <MomentCard
                moment={topShotMoments.find(
                  (moment) => moment.id.toString() === selectedMoment
                )}
                isClickable={false}
                style={CARD_SIZE}
              />
            ) : (
              <div
                className="p-4 bg-gray-800 rounded flex items-center justify-center"
                style={CARD_SIZE}
              >
                <span className="text-gray-400 text-4xl">?</span>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/3 p-4 flex items-center justify-center">
            <button
              onClick={handleUpdateTile}
              className="px-4 py-2 bg-blue-500 text-white hover:text-gray-300 rounded focus:outline-none"
            >
              Update Tile
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-semibold mb-2">Tile Collection</h3>
          <div className="grid grid-cols-3 gap-4">
            {paginatedTiles.map((tile) => (
              <TileCard
                key={tile.id}
                tile={tile}
                onSelect={setSelectedTile}
                isClickable={true}
                style={CARD_SIZE}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPageTiles}
            totalPages={Math.ceil(userTiles.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChangeTiles}
          />
        </div>

        <div className="w-full lg:w-1/2 p-4 bg-gray-700 rounded">
          <h3 className="text-xl font-semibold mb-2">
            NBA Top Shot Collection
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {paginatedMoments.map((moment) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                onSelect={setSelectedMoment}
                isClickable={true}
                style={CARD_SIZE}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPageMoments}
            totalPages={Math.ceil(topShotMoments.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChangeMoments}
          />
        </div>
      </div>
    </div>
  );
}

export default MyTiles;
