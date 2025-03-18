import { useNavigate } from "react-router-dom";
import "./Menubar.css";
import { Wrench, House } from "@phosphor-icons/react";


export default function Menubar() {
	const navigate = useNavigate(); // ✅ Move inside the function component

	return (
		<div className="menuBar">
			<button className="menuButton" onClick={() => navigate("/")}>
				<House size={48} weight="fill" />
				<span>Home</span>
			</button>
			<button className="menuButton" onClick={() => navigate("/settings")}>
				<Wrench size={48} weight="fill"/>
				<span>Settings</span>
			</button>
		</div>
	);
}
