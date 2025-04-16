
import "./Menubar.css";
import { Wrench, House, User, SignIn} from "@phosphor-icons/react";
import MenuButton from "./MenuButton.tsx";


export default function Menubar() {

	return (
		<div className="menuBar">
			<MenuButton icon={House} label="Home" path="/" />
			<MenuButton icon={Wrench} label="Settings" path="/settings" />
			<MenuButton icon={User} label="Profile" path="/profile" />
			<MenuButton icon={SignIn} label="Log In" path="/profile" />
		</div>
	);
}

