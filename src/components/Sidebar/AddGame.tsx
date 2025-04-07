import { useState } from "react";

export default function AddGame({ onAddGame, isCollapsed }) {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const sessionId = crypto.randomUUID(); // Any unique string
      const response = await fetch(
        `https://apis.roproxy.com/search-api/omni-search?searchQuery=${encodeURIComponent(
          query,
        )}&sessionId=${sessionId}`,
      );
      const data = await response.json();

      const games = data.searchResults
        .flatMap((group) => group.contents)
        .filter((item) => item.contentType === "Game");

      const sorted = games.sort((a, b) => b.playerCount - a.playerCount);
      const universeIds = sorted.map((g) => g.universeId).join(",");

      const iconRes = await fetch(
        `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeIds}&returnPolicy=PlaceHolder&size=256x256&format=Webp&isCircular=false`,
      );
      const iconData = await iconRes.json();

      const iconMap = {};
      iconData.data.forEach((item) => {
        iconMap[item.targetId] = item.imageUrl;
      });

      const resultsWithIcons = sorted.map((game) => ({
        ...game,
        icon: iconMap[game.universeId],
      }));

      setResults(resultsWithIcons);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (game) => {
    onAddGame(game.rootPlaceId);
    setShowModal(false);
    setResults([]);
    setQuery("");
  };

  return (
    <>
      <div
        className="flex h-12 w-full cursor-pointer flex-row items-center justify-center gap-3 px-4 select-none"
        onClick={() => setShowModal(true)}
        role="button"
      >
        <img className="h-8 opacity-60" src="/addGameSmaller.svg" alt="" />
        {!isCollapsed && <p>Add a Game</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/0">
          <div className="no-scrollbar max-h-[80vh] w-[600px] overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-5 text-center text-white backdrop-blur-2xl">
            <h3 className="mt-4 mb-8 text-5xl font-bold">Search Games</h3>
            {/* Search Bar */}
            <div className="sticky top-0 z-50 mb-4 flex gap-2 rounded-lg bg-black/60 backdrop-blur-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Roblox games..."
                className="flex-1 rounded-lg border border-white/30 bg-black/40 p-2.5 outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 m-1 h-[calc(100%-0.25rem-4px)] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {loading && <p>Searching...</p>}

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
                  {/*<img src="/currently-playing.svg" alt="" />*/}
                  <p className="text-xs opacity-60">
                    {game.playerCount.toLocaleString()} playing
                  </p>
                </div>
              ))}
            </div>

            <button
              className="mt-5 rounded border-0 bg-[#1d1d1d] px-4 py-2 text-white hover:bg-white/20"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
