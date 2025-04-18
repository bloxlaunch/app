import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatNumber } from "../Utils.tsx";
import { toast } from "sonner";
import AnimatedNumber from "../AnimatedNumber.tsx";
import ParallaxImage from "../ParallaxImage.tsx";
import useModalDismiss from "../../util/useModalDismiss.tsx";

export default function Game({ scrollContainer }) {
  const scrollRef = useRef(null);
  const { id } = useParams();
  const [gameData, setGameData] = useState(
    () => JSON.parse(localStorage.getItem("gameData")) || {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const [privateTab, setPrivateTab] = useState(false);

  const privateTabToggle = () => {
    setPrivateTab((prev) => !prev);
  };

  const [privateServers, setPrivateServers] = useState(() => {
    const saved = localStorage.getItem("privateServers");
    return saved ? JSON.parse(saved) : {};
  });
  const [linkInput, setLinkInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    index: null,
  });

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useModalDismiss(modalRef, showModal, () => setShowModal(false));

  const [privateTabOpen, setPrivateTabOpen] = useState(false);
  const privateTabRef = useRef<HTMLDivElement>(null);
  useModalDismiss(privateTabRef, privateTab, () => setPrivateTab(false));

  const currentGameServers = privateServers[id] || [];

  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  const handleAddPrivateServer = () => {
    try {
      const url = new URL(linkInput);
      const code = url.searchParams.get("code");
      const type = url.searchParams.get("type");
      if (!code || !type) throw new Error("Invalid link");

      const uri = `roblox://navigation/share_links?code=${code}&type=${type}`;
      const newEntry = { label: labelInput || "Private Server", uri };

      const updatedServers = {
        ...privateServers,
        [id]: [...(privateServers[id] || []), newEntry],
      };

      setPrivateServers(updatedServers);
      localStorage.setItem("privateServers", JSON.stringify(updatedServers));
      setLinkInput("");
      setLabelInput("");
      setShowModal(false);
    } catch (err) {
      toast.error("Invalid Roblox private server link");
    }
  };

  const handleRenameServer = (index) => {
    const label = prompt("Enter new label:");
    if (!label) return;
    const updated = [...currentGameServers];
    updated[index].label = label;

    const newData = { ...privateServers, [id]: updated };
    setPrivateServers(newData);
    localStorage.setItem("privateServers", JSON.stringify(newData));
  };

  const handleDeleteServer = (index) => {
    const updated = [...currentGameServers];
    updated.splice(index, 1);

    const newData = { ...privateServers, [id]: updated };
    setPrivateServers(newData);
    localStorage.setItem("privateServers", JSON.stringify(newData));
  };

  useEffect(() => {
    async function fetchGameData() {
      try {
        setLoading(true);
        setError(null);

        const universeResponse = await fetch(
          `https://apis.roproxy.com/universes/v1/places/${id}/universe`,
        );
        const universeData = await universeResponse.json();
        if (!universeData.universeId)
          throw new Error("Failed to retrieve universe ID");

        const detailsResponse = await fetch(
          `https://games.roproxy.com/v1/games?universeIds=${universeData.universeId}`,
        );
        const detailsData = await detailsResponse.json();
        if (!detailsData.data || detailsData.data.length === 0)
          throw new Error("No game details found");

        const gameDetails = detailsData.data[0];

        const bannerPromise = fetch(
          `https://thumbnails.roproxy.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=1320x440&format=Webp&isCircular=false`,
        );

        const mediaPromise = fetch(
          `https://games.roproxy.com/v2/games/${universeData.universeId}/media`,
        );

        const bannerResponse = await bannerPromise;
        const bannerData = await bannerResponse.json();
        const bannerItem = bannerData.data.find(
          (item) => item.targetId === parseInt(id),
        );

        const mediaResponse = await mediaPromise;
        const mediaData = await mediaResponse.json();
        if (!Array.isArray(mediaData.data))
          throw new Error("Media data malformed or missing");

        const validImages = mediaData.data.filter(
          (item) =>
            item.assetType === "Image" && typeof item.imageId === "number",
        );
        const imageIds = validImages.map((item) => item.imageId);

        let thumbnails = [];
        if (imageIds.length > 0) {
          const thumbnailsResponse = await fetch(
            `https://thumbnails.roproxy.com/v1/games/${universeData.universeId}/thumbnails?thumbnailIds=${imageIds.join(",")}&size=768x432&format=Webp&isCircular=false`,
          );
          const thumbnailsData = await thumbnailsResponse.json();

          thumbnails = thumbnailsData.data
            .filter((t) => t.state === "Completed" && t.imageUrl)
            .map((t) => t.imageUrl);
        }

        const videos = mediaData.data
          .filter((item) => item.assetType === "YouTubeVideo" && item.videoHash)
          .map((item) => `https://www.youtube.com/embed/${item.videoHash}`);

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
            banner: bannerItem?.imageUrl || "https://placehold.co/1320x440",
            thumbnails,
            videos,
          },
        };

        setGameData(updatedGameData);
        localStorage.setItem("gameData", JSON.stringify(updatedGameData));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to update game info.", err);
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  const renderGameUI = (message = null) => (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="gameSection"
      ref={scrollRef}
    >
      <div className="bannerIcon">
        <div className="bannerContainer rounded-xl">
          <motion.h2
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 z-[99] mb-9 ml-5 text-4xl font-bold text-white drop-shadow-[0_0_10px_rgb(0,0,0,0.6)] select-none text-shadow-lg md:text-5xl lg:text-6xl"
          >
            {gameData[id]?.title}
          </motion.h2>
          <ParallaxImage
            key="banner-front"
            src={gameData[id]?.banner || "https://placehold.co/1320x440"}
            alt="Game Banner"
            className="gameBanner select-none"
            speed={0.36}
            scrollContainer={scrollContainer}
          />
          <ParallaxImage
            key="banner-back"
            src={gameData[id]?.banner || "https://placehold.co/1320x440"}
            alt="Game Banner"
            className="gameBannerBack select-none"
            speed={0.36}
            scrollContainer={scrollContainer}
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
              onMouseDown={(e) => e.stopPropagation()}
              onClick={privateTabToggle}
              className={
                "flex w-12 cursor-pointer content-center items-center justify-center rounded-md bg-blue-600 py-2 align-middle font-bold text-white"
              }
            >
              <motion.img
                className={"h-3 select-none"}
                src="/down-small-on.svg"
                alt=""
                animate={{ rotate: privateTab ? 0 : 90 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </button>
            {privateTab && (
              <motion.div
                ref={privateTabRef}
                className="bg-gray/100 absolute z-50 mt-14 h-auto w-77 rounded-lg border border-white/10 bg-black/100 p-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex flex-wrap gap-1">
                  {currentGameServers.map((server, i) => (
                    <button
                      key={i}
                      onClick={() => (window.location.href = server.uri)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          visible: true,
                          x: e.clientX,
                          y: e.clientY,
                          index: i,
                        });
                      }}
                      className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      {server.label}
                    </button>
                  ))}
                </div>
                <div
                  className="mt-1 flex h-6 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md px-4 py-5 select-none hover:bg-white/5"
                  role="button"
                  onClick={() => setShowModal(true)}
                >
                  <img
                    className="h-6 opacity-60"
                    src="/addGameSmaller.svg"
                    alt=""
                  />
                  <p>Add a Private Server</p>
                </div>
              </motion.div>
            )}
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
              <AnimatedNumber
                value={gameData[id]?.playing || 0}
                format={formatNumber}
              />
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
              <AnimatedNumber
                value={gameData[id]?.visits || 0}
                format={formatNumber}
              />
            </span>
          </div>
          {/*<div className={"ml-5 h-full w-[1px] rounded-3xl bg-white/10"}></div>*/}
        </div>
        <div className={"p-6"}>
          <div className={"h-auto w-full border-white/10 bg-white/0"}>
            <h2
              className={"pb-4 text-4xl font-semibold text-white select-none"}
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
          <div className="mt-4 mb-8 grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                loading="lazy"
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
    <>
      <AnimatePresence>
        {showModal && (
          /* overlay */
          <motion.div
            className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* modal card */}
            <motion.div
              ref={modalRef}
              className="no-scrollbar mx-5 max-h-[80vh] w-[450px] overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-5 text-white backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {/* close icon */}
              <img
                src="https://api.iconify.design/mdi:close.svg"
                alt="close"
                className="absolute top-0 right-0 m-2 cursor-pointer rounded p-2 invert select-none hover:bg-white/20"
                onClick={() => setShowModal(false)}
              />

              {/* heading */}
              <h3 className="mt-2 text-3xl font-bold select-none">
                Add Private Server
              </h3>
              <p
                className={"text-md mb-4 font-medium text-white/80 select-none"}
              >
                {gameData[id]?.title}
              </p>

              {/* inputs */}
              <input
                type="text"
                placeholder="My Private Server"
                className="mb-3 w-full rounded-lg border border-white/20 bg-black/40 p-2.5 text-white placeholder-white/50 outline-none select-none"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
              />

              <input
                type="text"
                placeholder="https://www.roblox.com/share?code=2cedcaa60a4f5e439f1e8d584efb71e6&type=Server"
                className="mb-3 w-full rounded-lg border border-white/20 bg-black/40 p-2.5 text-white placeholder-white/50 outline-none select-none"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />

              {/* action buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAddPrivateServer}
                  className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {contextMenu.visible && (
        <div
          className="fixed z-50 rounded-lg border border-white/20 bg-black/80 p-1 text-lg text-white shadow-2xl backdrop-blur-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            className="block w-full rounded-md px-4 py-2 text-left hover:bg-white/10"
            onClick={() => {
              handleRenameServer(contextMenu.index);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            Rename
          </button>
          <button
            className="block w-full rounded-md px-4 py-2 text-left hover:bg-white/10"
            onClick={() => {
              handleDeleteServer(contextMenu.index);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            Delete
          </button>
        </div>
      )}
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
                Loading game...
              </p>
            </div>
          </motion.div>
        ) : (
          renderGameUI(error ? "Error: Please try again later." : null)
        )}
      </AnimatePresence>
      );
    </>
  );
}
