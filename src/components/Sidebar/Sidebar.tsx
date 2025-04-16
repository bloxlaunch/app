import { useEffect, useRef, useState } from "react";
import GameGrid from "./GameGrid.tsx";
import LocalSearch from "./LocalSearch.tsx";
import AddGame from "./AddGame.tsx";

export default function Sidebar() {
  const [games, setGames] = useState(() => {
    return JSON.parse(localStorage.getItem("games")) || [];
  });

  const [gameImages, setGameImages] = useState(() => {
    return JSON.parse(localStorage.getItem("gameImages")) || {};
  });

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddGame = (gameId) => {
    const updatedGames = [...games, { id: gameId }];
    setGames(updatedGames);
    localStorage.setItem("games", JSON.stringify(updatedGames));
  };

  // Vertical resizing logic
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();

    const sidebar = sidebarRef.current;
    if (!sidebar) return; // 💥 Exit if the ref hasn't attached yet

    const sidebarRect = sidebar.getBoundingClientRect();

    const offsetX = e.clientX - sidebarRect.right;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX - sidebarRect.left - offsetX;
      sidebar.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ✅ Detect when sidebar is collapsed
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setIsCollapsed(width <= 50);
      }
    });

    observer.observe(sidebar);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="relative z-[999] flex w-96 max-w-[600px] min-w-[80px] flex-col overflow-hidden overflow-x-auto bg-black/15 select-none"
    >
      <div
        onMouseDown={startResizing}
        className={
          "absolute top-0 right-0 z-[100] h-full w-1 cursor-ew-resize hover:bg-white/50"
        }
      ></div>
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <GameGrid
          games={games}
          setGames={setGames}
          gameImages={gameImages}
          setGameImages={setGameImages}
        />
      </div>
      <div className="border-t border-white/10 p-1">
        <AddGame onAddGame={handleAddGame} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
