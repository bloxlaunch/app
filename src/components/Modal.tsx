import {useEffect, useState} from "react";
import GameGrid from "./Sidebar/GameGrid.tsx";
import LocalSearch from "./Sidebar/LocalSearch.tsx";
import AddGame from "./Sidebar/AddGame.tsx";


export default function Modal() {
	return (
		<div className={"modal"}>
			<div className="container">
				<p>Add a Game</p>
			</div>
		</div>
	);
}


