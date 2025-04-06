import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatNumber } from "../Utils.tsx";

export default function Game() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(
    () => JSON.parse(localStorage.getItem("gameData")) || {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchGameData() {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Get Universe ID
        const universeResponse = await fetch(
          `https://apis.roproxy.com/universes/v1/places/${id}/universe`,
        );
        const universeData = await universeResponse.json();
        if (!universeData.universeId)
          throw new Error("Failed to retrieve universe ID");

        // Step 2: Fetch game details using Universe ID
        const detailsUrl = `https://games.roproxy.com/v1/games?universeIds=${universeData.universeId}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        if (!detailsData.data || detailsData.data.length === 0)
          throw new Error("No game details found");

        const gameDetails = detailsData.data[0];

        // Step 3: Fetch game icon and banner
        const [iconResponse, bannerResponse] = await Promise.all([
          fetch(
            `https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=${id}&returnPolicy=PlaceHolder&size=512x512&format=Webp&isCircular=false`,
          ),
          fetch(
            `https://thumbnails.roproxy.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=1320x440&format=Png&isCircular=false`,
          ),
        ]);

        const iconData = await iconResponse.json();
        const bannerData = await bannerResponse.json();

        // Extract icon & banner
        const iconItem = iconData.data.find(
          (item) => item.targetId === parseInt(id),
        );
        const bannerItem = bannerData.data.find(
          (item) => item.targetId === parseInt(id),
        );

        // Update state with all game data
        const updatedGameData = {
          ...gameData,
          [id]: {
            title: gameDetails.name || "Unknown Game",
            description: gameDetails.description || "No description available",
            playing: gameDetails.playing || 0,
            visits: gameDetails.visits || 0,
            maxPlayers: gameDetails.maxPlayers || "N/A",
            genre: gameDetails.genre || "Unknown",
            creator: gameDetails.creator?.name || "Unknown Creator",
            icon: iconItem?.imageUrl || "https://via.placeholder.com/512",
            banner:
              bannerItem?.imageUrl || "https://via.placeholder.com/1320x440",
          },
        };

        setGameData(updatedGameData);
        localStorage.setItem("gameData", JSON.stringify(updatedGameData));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch game data:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  const renderGameUI = (message = null) => (
    <motion.div
      key={id} // Ensure Framer Motion re-renders on ID change
      initial={{ opacity: 0, y: 30 }} // Slide-in animation
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }} // Slide-out animation
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="gameSection"
    >
      <div className="bannerIcon">
        <div className="bannerContainer">
          <img
            src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"}
            alt="Game Banner"
            className="gameBanner"
            loading="lazy"
          />
          <img
            src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"}
            alt="Game Banner"
            className="gameBannerBack"
            loading="lazy"
          />
        </div>
        {/*<img*/}
        {/*  src={gameData[id]?.icon || "https://via.placeholder.com/512"}*/}
        {/*  alt="Game Icon"*/}
        {/*  className="gameIcon"*/}
        {/*  loading="lazy"*/}
        {/*/>*/}
      </div>

      <div className="relative z-20 mt-[-20px] flex h-[1000px] flex-col border-t border-white/10 bg-black/25 backdrop-blur-xl">
        <div className={"bg-g flex h-20 w-full bg-black/0 px-6 py-4"}>
          <div className={"flex flex-row gap-1"}>
            {/* Play Button */}
            <button
              onClick={() =>
                (window.location.href = `roblox://experiences/start?placeId=${gameData[id]}`)
              }
              className={
                "flex w-52 cursor-pointer content-center items-center justify-center rounded-md bg-blue-600 py-2 align-middle"
              }
            >
              <img className={"h-7"} src="/Play.svg" alt="" />
            </button>
            {/* More Button*/}
            <button
              className={
                "flex w-12 cursor-pointer content-center items-center justify-center rounded-md bg-blue-600 py-2 align-middle font-bold text-white"
              }
            >
              <img className={"h-3"} src="/down-small-on.svg" alt="" />
            </button>
            {/*<div*/}
            {/*  className={*/}
            {/*    "absolute z-50 mt-13 h-40 w-65 rounded-md border border-white/10 bg-white/20 backdrop-blur-md"*/}
            {/*  }*/}
            {/*></div>*/}
          </div>
          {/* Player Count */}
          <div
            className={
              "flex content-center items-center justify-center gap-2 pl-5"
            }
          >
            <img className={"h-10"} src="/currently-playing.svg" alt="" />
            <span className={"text-3xl font-bold text-white"}>
              {formatNumber(gameData[id]?.playing)}
            </span>
          </div>
          <div className={"ml-5 h-full w-[1px] rounded-3xl bg-white/10"}></div>
          {/* Visits Count */}
          <div
            className={
              "flex content-center items-center justify-center gap-2 pl-5"
            }
          >
            <img className={"h-10"} src="/Play.svg" alt="" />
            <span className={"text-3xl font-bold text-white"}>
              {formatNumber(gameData[id]?.visits)}
            </span>
          </div>
          <div className={"ml-5 h-full w-[1px] rounded-3xl bg-white/10"}></div>
        </div>
        <div className={"p-8"}>
          <p>
            <strong>Created by:</strong> {gameData[id]?.creator}
          </p>
          <p>
            <strong>Genre:</strong> {gameData[id]?.genre}
          </p>
          <p>
            <strong>Players Online:</strong> {gameData[id]?.playing}
          </p>
          <p>
            <strong>Total Visits:</strong> {gameData[id]?.visits}
          </p>
          <p>
            <strong>Max Players:</strong> {gameData[id]?.maxPlayers}
          </p>
          <p>{gameData[id]?.description}</p>
          <br />
          {message && (
            <p>
              <strong>{message}</strong>
            </p>
          )}
        </div>
      </div>

      <img
        src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"}
        alt="Game Banner"
        className="gameBackground"
        loading="lazy"
      />
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {loading
        ? renderGameUI("Loading game...")
        : error
          ? renderGameUI("Error: Please try again in 30 seconds.")
          : renderGameUI()}
    </AnimatePresence>
  );
}
