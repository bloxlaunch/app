export default function AddGame() {
  return (
    <div
      className="flex h-16 w-full cursor-pointer flex-row items-center justify-center gap-3 px-4 select-none"
      onClick={() => setShowModal(true)}
      role="button"
    >
      <img className={"h-8 opacity-60"} src="/addGameSmaller.svg" alt="" />
      <p>Add a Game</p>
    </div>
  );
}

//    display: flex;
//     gap: 15px;
//     width: 100%;
//     margin: 5px;
//     border-radius: 5px;

//    display: flex;
//     width: 100%;
//     justify-content: center;
//     flex-direction: row;
//     border: none;
//     background-color: rgba(255, 255, 255, 0);
//     cursor: pointer;
//     align-items: center;
//     gap: 15px;
