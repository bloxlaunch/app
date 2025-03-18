import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.tsx";

export default function GamesLayout() {
	return (
		<div className="gamesPage">
			<Sidebar /> {/* ✅ Sidebar is only visible inside `/games/*` */}
			<div className="gameContent">
				<Outlet /> {/* ✅ This renders the nested routes (Game.tsx) */}
			</div>
		</div>
	);
}
