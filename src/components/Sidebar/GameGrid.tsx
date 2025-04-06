import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddGame from "./AddGame.tsx";
import "./Sidebar.css";

export default function GameGrid({
  games,
  setGames,
  gameImages,
  setGameImages,
}) {
  const navigate = useNavigate();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    gameId: null,
  });

  // Close context menu when clicking anywhere else
  useEffect(() => {
    const handleClick = () => {
      setContextMenu({ ...contextMenu, visible: false });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  useEffect(() => {
    if (games.length === 0) return;

    async function fetchGameIcons() {
      try {
        const gameIds = games.map((game) => game.id).join(",");
        const response = await fetch(
          `https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=${gameIds}&returnPolicy=PlaceHolder&size=512x512&format=Webp&isCircular=false`,
        );
        const data = await response.json();

        if (data.data) {
          const newImageMap = {};
          let cacheUpdated = false;

          data.data.forEach((item) => {
            const gameId = item.targetId;
            const newImageUrl = item.imageUrl;

            if (gameImages[gameId] !== newImageUrl) {
              cacheUpdated = true;
            }
            newImageMap[gameId] = newImageUrl;
          });

          if (cacheUpdated) {
            setGameImages(newImageMap);
            localStorage.setItem("gameImages", JSON.stringify(newImageMap));
          }
        }
      } catch (error) {
        console.error("Failed to fetch game icons:", error);
      }
    }

    fetchGameIcons();
  }, [games]);

  return (
    <div className="gameContainer no-scrollbar grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 overflow-visible">
      {games.map((game, index) => (
        <div
          key={index}
          className="gameButton"
          onClick={() => navigate(`/game/${game.id}`)}
          onDoubleClick={() =>
            (window.location.href = `roblox://experiences/start?placeId=${game.id}`)
          }
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({
              visible: true,
              x: e.clientX,
              y: e.clientY,
              gameId: game.id,
            });
          }}
          role="button"
          tabIndex={0}
        >
          <img
            src={gameImages[game.id] || "https://via.placeholder.com/512"}
            alt={`Game ${index + 1}`}
            loading="lazy"
          />
        </div>
      ))}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 rounded-xl bg-white text-black shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => {
            const updatedGames = games.filter(
              (g) => g.id !== contextMenu.gameId,
            );
            setGames(updatedGames);
            localStorage.setItem("games", JSON.stringify(updatedGames));
            setContextMenu({ ...contextMenu, visible: false });
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left hover:bg-red-500 hover:text-white">
            Remove Game
          </button>
        </div>
      )}
    </div>
  );
}
