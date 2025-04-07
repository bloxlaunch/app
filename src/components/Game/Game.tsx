import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatNumber } from "../Utils.tsx";
import { toast } from "sonner";

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

        // Step 4: Fetch media items
        const mediaUrl = `https://games.roproxy.com/v2/games/${universeData.universeId}/media`;
        const mediaResponse = await fetch(mediaUrl);
        const mediaData = await mediaResponse.json();

        if (!Array.isArray(mediaData.data))
          throw new Error("Media data malformed or missing");

        // Filter only image items with a valid imageId
        const validImages = mediaData.data.filter(
          (item) =>
            item.assetType === "Image" && typeof item.imageId === "number",
        );

        const imageIds = validImages.map((item) => item.imageId);

        // Only request thumbnails if we have image IDs
        let thumbnails = [];
        if (imageIds.length > 0) {
          const thumbnailsApi = `https://thumbnails.roproxy.com/v1/games/${universeData.universeId}/thumbnails?thumbnailIds=${imageIds.join(
            ",",
          )}&size=768x432&format=Webp&isCircular=false`;

          const thumbnailsResponse = await fetch(thumbnailsApi);
          const thumbnailsData = await thumbnailsResponse.json();

          thumbnails = thumbnailsData.data
            .filter((t) => t.state === "Completed" && t.imageUrl)
            .map((t) => t.imageUrl);
        }

        const videos = mediaData.data
          .filter((item) => item.assetType === "YouTubeVideo" && item.videoHash)
          .map((item) => `https://www.youtube.com/embed/${item.videoHash}`);

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
            icon: iconItem?.imageUrl || "https://placehold.co/512",
            banner: bannerItem?.imageUrl || "https://placehold.co/1320x440",
            thumbnails,
            videos,
          },
        };

        setGameData(updatedGameData);
        localStorage.setItem("gameData", JSON.stringify(updatedGameData));
        setLoading(false);
      } catch (err) {
        // console.error("Failed to fetch game data:", err);
        setError(err.message);
        toast.error("Failed to update game data.", err);
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
        <div className="bannerContainer rounded-xl">
          <h2
            className={
              "absolute bottom-0 left-0 z-[99] mb-9 ml-5 text-4xl font-bold text-white select-none text-shadow-lg md:text-5xl lg:text-6xl"
            }
          >
            {gameData[id]?.title}
          </h2>
          <img
            src={gameData[id]?.banner || "https://placehold.co/1320x440"}
            alt="Game Banner"
            className="gameBanner select-none"
            loading="lazy"
          />
          <img
            src={gameData[id]?.banner || "https://placehold.co/1320x440"}
            alt="Game Banner"
            className="gameBannerBack select-none"
            loading="lazy"
          />
        </div>
      </div>

      <div className="relative z-10 mt-[-20px] flex h-auto flex-col border-t border-white/10 bg-black/35 pb-8 backdrop-blur-xl">
        <div className="bg-g z-10 flex h-21 w-full bg-black/0 px-6 py-4">
          <div className={"flex flex-row gap-1"}>
            {/* Play Button */}
            <button
              onClick={() =>
                (window.location.href = `roblox://experiences/start?placeId=${id}`)
              }
              className="flex w-64 cursor-pointer content-center items-center justify-center rounded-md bg-blue-600 py-2 align-middle"
            >
              <img className="h-7 select-none" src="/Play.svg" alt="" />
            </button>

            {/* More Button*/}
            <button
              className={
                "flex w-12 cursor-pointer content-center items-center justify-center rounded-md bg-blue-600 py-2 align-middle font-bold text-white"
              }
            >
              <img
                className={"h-3 select-none"}
                src="/down-small-on.svg"
                alt=""
              />
            </button>
            <div
              className={
                "bg-gray/100 absolute z-50 mt-14 h-auto w-77 rounded-md border border-white/10 bg-white/50"
              }
            >
              <div
                className="flex h-6 w-full cursor-pointer flex-row items-center justify-center gap-2 px-4 select-none"
                role="button"
              >
                <img
                  className="h-6 opacity-60"
                  src="/addGameSmaller.svg"
                  alt=""
                />
                <p>Add a Private Server</p>
                {/*  roblox://navigation/share_links?code=ce65b2c80e8dae48866fe2f919966557&type=Server  */}
              </div>
            </div>
          </div>
          <div className={"ml-5 h-full w-[1px] rounded-3xl bg-white/10"}></div>
          {/* Player Count */}
          <div
            className={
              "flex content-center items-center justify-center gap-2 pl-5"
            }
          >
            <img
              className={"h-10 select-none"}
              src="/currently-playing.svg"
              alt=""
            />
            <span className={"text-3xl font-bold text-white select-none"}>
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
            <img className={"h-10 select-none"} src="/Play.svg" alt="" />
            <span className={"text-3xl font-bold text-white select-none"}>
              {formatNumber(gameData[id]?.visits)}
            </span>
          </div>
          {/*<div className={"ml-5 h-full w-[1px] rounded-3xl bg-white/10"}></div>*/}
        </div>
        <div className={"p-6"}>
          <div className={"h-auto w-full border-white/10 bg-white/0 p-2"}>
            <h2
              className={
                "pt-2 pb-4 text-4xl font-semibold text-white select-none"
              }
            >
              Description
            </h2>
            <p className={"w-full lg:w-[700px]"}>
              {gameData[id]?.description?.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <h2
            className={
              "pt-6 pb-0 text-4xl font-semibold text-white select-none"
            }
          >
            Thumbnails
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {gameData[id]?.videos?.map((video, i) => (
              <div
                key={i}
                className="relative w-full rounded-2xl pb-[56.25%] select-none"
              >
                <iframe
                  src={video}
                  title={`Video ${i + 1}`}
                  className="absolute top-0 left-0 h-full w-full rounded"
                  allowFullScreen
                />
              </div>
            ))}

            {gameData[id]?.thumbnails?.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full rounded-2xl object-cover select-none"
              />
            ))}
          </div>

          <br />
          {message && (
            <p>
              <strong>{message}</strong>
            </p>
          )}
        </div>
      </div>

      <img
        // src={gameData[id]?.banner || "https://placehold.co/1320x440"}
        src={gameData[id]?.banner || "https://placehold.co/1320x440"}
        alt="Game Banner"
        className="gameBackground select-none"
        loading="lazy"
      />
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {!gameData[id]?.banner ? (
        // 🔄 Show loading screen if banner doesn't exist
        <motion.div
          key="loading"
          className="flex min-h-screen items-center justify-center rounded-xl bg-black/40 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <img
              src="/bouncing-circles.svg"
              alt="Loading..."
              className="mx-auto mb-4 h-10 w-10 select-none"
            />
            <p className="text-xl font-semibold select-none">
              Loading game data...
            </p>
          </div>
        </motion.div>
      ) : (
        renderGameUI(error ? "Error: Please try again later." : null)
      )}
    </AnimatePresence>
  );
}
