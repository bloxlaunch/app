import { useNavigate } from "react-router-dom";

export default function MenuButton({ icon: Icon, label, path }) {
	const navigate = useNavigate();

	return (
		<button className="menuButton" onClick={() => navigate(path)}>
			<Icon size={48} weight="fill" />
			<span>{label}</span>
		</button>
	);
}
