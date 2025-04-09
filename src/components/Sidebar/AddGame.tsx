import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AddGame({ onAddGame, isCollapsed }) {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const sessionId = crypto.randomUUID();
      const response = await fetch(
        `https://apis.roproxy.com/search-api/omni-search?searchQuery=${encodeURIComponent(
          query,
        )}&sessionId=${sessionId}`,
      );
      const data = await response.json();

      const games = data.searchResults
        .flatMap((group) => group.contents)
        .filter((item) => item.contentType === "Game");

      // const sorted = games.sort((a, b) => b.playerCount - a.playerCount);
      // const universeIds = sorted.map((g) => g.universeId).join(",");
      const universeIds = games.map((g) => g.universeId).join(",");

      const iconRes = await fetch(
        `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeIds}&returnPolicy=PlaceHolder&size=256x256&format=Webp&isCircular=false`,
      );
      const iconData = await iconRes.json();

      const iconMap = {};
      iconData.data.forEach((item) => {
        iconMap[item.targetId] = item.imageUrl;
      });

      const resultsWithIcons = games.map((game) => ({
        ...game,
        icon: iconMap[game.universeId],
      }));

      setResults(resultsWithIcons);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (game) => {
    if (!game.rootPlaceId) return;

    // Avoid duplicates
    const alreadyExists = localStorage
      .getItem("games")
      ?.includes(game.rootPlaceId);
    if (alreadyExists) {
      toast.error("This game is already added.");
      navigate(`/game/${game.rootPlaceId}`);
      setShowModal(false);
      setResults([]);
      setQuery("");
      return;
    }

    onAddGame(game.rootPlaceId); // use placeId
    navigate(`/game/${game.rootPlaceId}`);
    setShowModal(false);
    setResults([]);
    setQuery("");
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  return (
    <>
      <div
        className="flex h-6 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md px-4 py-5 select-none hover:bg-white/5"
        onClick={() => setShowModal(true)}
        role="button"
      >
        <img className="h-6 opacity-60" src="/addGameSmaller.svg" alt="" />
        {!isCollapsed && <p>Add a Game</p>}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[125] flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="no-scrollbar mx-5 max-h-[80vh] w-[600px] overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-5 text-center text-white backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <img
                className="absolute top-0 right-0 m-2 cursor-pointer rounded border-0 px-2 py-2 text-white invert hover:bg-white/20"
                src="https://api.iconify.design/mdi:close.svg"
                alt="close"
                onClick={() => setShowModal(false)}
              />
              <h3 className="mt-4 mb-8 text-5xl font-bold">Search Games</h3>

              <form
                className="sticky top-0 z-50 mb-4 flex gap-2 rounded-lg bg-black/60 backdrop-blur-xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Roblox games..."
                  className="flex-1 rounded-lg border border-white/20 bg-black/40 p-2.5 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 m-1 h-[calc(100%-0.25rem-4px)] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Search
                </button>
              </form>

              {loading && (
                // <p>Searching...</p>
                <img src="" alt="" />
              )}
              {error && <p className="text-red-500">{error}</p>}

              <div className="grid grid-cols-3 gap-4">
                {results.map((game, i) => (
                  <div
                    key={i}
                    onClick={() => handleAdd(game)}
                    className="cursor-pointer rounded-lg border border-white/10 bg-black/40 p-2 hover:bg-white/10"
                  >
                    <img
                      src={game.icon || "https://via.placeholder.com/512"}
                      alt={game.name}
                      className="mb-2 h-auto w-full rounded-md object-cover"
                    />
                    <p className="text-md font-semibold">{game.name}</p>
                    <p className="text-xs opacity-60">
                      {game.playerCount.toLocaleString()} playing
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
