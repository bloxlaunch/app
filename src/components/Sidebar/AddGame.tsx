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
        <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-black/40">
          <div className="rounded-xl bg-black/90 p-5 text-center backdrop-blur-[25px]">
            <h3>Add New Game</h3>
            <input
              type="text"
              value={newGameId}
              onChange={(e) => setNewGameId(e.target.value)}
              placeholder="Enter Game ID"
              className={"my-2.5 w-full border border-white/30 p-2.5"}
            />
            <button
              className={
                "m-1.5 cursor-pointer rounded border-0 bg-[#1d1d1d] p-2.5 text-white"
              }
              onClick={handleSubmit}
            >
              Add
            </button>
            <button
              className={
                "m-1.5 cursor-pointer rounded border-0 bg-[#1d1d1d] p-2.5 text-white"
              }
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
