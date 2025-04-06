import { useState, useEffect } from "react";

export default function AddGame({ onAddGame, isCollapsed }) {
  const [showModal, setShowModal] = useState(false);
  const [newGameId, setNewGameId] = useState("");

  const handleSubmit = () => {
    if (!newGameId) return alert("Please enter a game ID");
    onAddGame(newGameId);
    setNewGameId("");
    setShowModal(false);
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
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Game</h3>
            <input
              type="text"
              value={newGameId}
              onChange={(e) => setNewGameId(e.target.value)}
              placeholder="Enter Game ID"
            />
            <button onClick={handleSubmit}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
