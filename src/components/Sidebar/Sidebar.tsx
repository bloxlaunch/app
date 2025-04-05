import { useEffect, useState } from "react";
import GameGrid from "./GameGrid.tsx";
import LocalSearch from "./LocalSearch.tsx";
import AddGame from "./AddGame.tsx";

import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="relative z-[999] mx-10 mb-10 flex w-96 max-w-[600px] min-w-[80px] resize-x flex-col overflow-hidden overflow-x-auto rounded-md bg-[rgba(60,60,73,0.2)]">
      {/*<div className="localSearch">*/}
      {/*	<LocalSearch/>*/}
      {/*</div>*/}
      <div className="flex-1 overflow-y-auto">
        <GameGrid />
      </div>
      <div className={"border-t border-white/10 p-3"}>
        <AddGame />
      </div>
    </div>
  );
}
