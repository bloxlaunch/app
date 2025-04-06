import "./page.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState(() => {
    return JSON.parse(localStorage.getItem("games")) || [];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="page"
    >
      <h1>Home</h1>

      {games.length === 0 ? (
        <div className="mt-4 text-gray-400">
          <p>You don’t have any games yet.</p>
          <p>Click "Add a Game" to get started!</p>
        </div>
      ) : (
        <div className="mt-4 text-green-500">
          <p>
            You have {games.length} game{games.length > 1 ? "s" : ""} added.
          </p>
        </div>
      )}
    </motion.div>
  );
}
