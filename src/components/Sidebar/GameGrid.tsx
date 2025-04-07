import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { rectSortingStrategy } from "@dnd-kit/sortable";

function SortableGame({ game, gameImages, index, navigate, onContextMenu }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: game.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="gameButton"
      onClick={() => navigate(`/game/${game.id}`)}
      onDoubleClick={() =>
        (window.location.href = `roblox://experiences/start?placeId=${game.id}`)
      }
      onContextMenu={(e) => {
        e.preventDefault(); // ✅ Prevent browser context menu here
        onContextMenu(e, game.id);
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
  );
}

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

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // Drag sensors with delay
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 4,
      },
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = games.findIndex((g) => g.id === active.id);
      const newIndex = games.findIndex((g) => g.id === over.id);
      const reordered = arrayMove(games, oldIndex, newIndex);
      setGames(reordered);
      localStorage.setItem("games", JSON.stringify(reordered));
    }
  };

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
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={games.map((g) => g.id)}
          strategy={rectSortingStrategy}
        >
          <div className="gameContainer no-scrollbar grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 overflow-visible">
            {games.map((game, index) => (
              <SortableGame
                key={game.id}
                game={game}
                gameImages={gameImages}
                index={index}
                navigate={navigate}
                onContextMenu={(e, id) =>
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    gameId: id,
                  })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 rounded-lg border border-white/20 bg-black/80 text-lg text-white shadow-2xl shadow-md backdrop-blur-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => {
            const updatedGames = games.filter(
              (g) => g.id !== contextMenu.gameId,
            );
            setGames(updatedGames);
            localStorage.setItem("games", JSON.stringify(updatedGames));
            setContextMenu({ ...contextMenu, visible: false });
          }}
          onContextMenu={(e) => e.preventDefault()} // prevent on right click here too
        >
          <button className="block w-full cursor-pointer rounded-lg px-4 py-2 text-left hover:bg-white/10 hover:text-white">
            Remove Game
          </button>
        </div>
      )}
    </>
  );
}
