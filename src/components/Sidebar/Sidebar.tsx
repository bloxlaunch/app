import {useEffect, useState} from "react";
import GameGrid from "./GameGrid.tsx";
import LocalSearch from "./LocalSearch.tsx";
import AddGame from "./AddGame.tsx";

import "./Sidebar.css";



export default function Sidebar() {
	return (
		<div className="sideBar">
			{/*<div className="localSearch">*/}
			{/*	<LocalSearch/>*/}
			{/*</div>*/}
			<div className="gameGrid">
				<GameGrid/>
			</div>
			<div className="localSearch">
				<AddGame/>
			</div>
		</div>
	);
}


