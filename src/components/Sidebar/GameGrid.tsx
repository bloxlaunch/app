import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddGame from "./AddGame.tsx"; // moved from Sidebar to here
import "./Sidebar.css";

export default function GameGrid() {
  const navigate = useNavigate();
  const [games, setGames] = useState(() => {
    return JSON.parse(localStorage.getItem("games")) || [];
  });

  const [gameImages, setGameImages] = useState(() => {
    return JSON.parse(localStorage.getItem("gameImages")) || {};
  });

  // Fetch icons
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

  // Handler to pass to AddGame
  const handleAddGame = (gameId) => {
    const updatedGames = [...games, { id: gameId }];
    setGames(updatedGames);
    localStorage.setItem("games", JSON.stringify(updatedGames));
  };

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
      <AddGame onAddGame={handleAddGame} />
    </div>
  );
}
