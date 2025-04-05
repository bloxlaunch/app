import "./Sidebar.css";

export default function AddGame() {
	return (
		<div className="addGame"  onClick={() => setShowModal(true)} role="button">
			<button>
							<span>
				<img src="/addGameSmaller.svg" alt=""/>
			</span>
				<p>Add a Game</p>
			</button>

		</div>
	)
}