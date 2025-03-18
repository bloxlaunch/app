import {useEffect, useState} from "react";

import "./Menubar.css";
import { Wrench } from "@phosphor-icons/react";


export default function Menubar() {
	return (
		<div className="menuBar">
			<button className={"menuButton"}>
				{/*<SlidersHorizontal color="#d2d2d2" size={52} />*/}
				<Wrench size={48} weight="fill" />
				{/*<Settings color="#d2d2d2" size={42}/>*/}
				<span>Settings</span>
			</button>
		</div>
	);
}


