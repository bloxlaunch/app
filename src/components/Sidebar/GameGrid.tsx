import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function GameGrid() {
	const clearGames = () => {
		localStorage.removeItem("games"); // Remove games from storage
		localStorage.removeItem("gameImages"); // Remove cached images
		setGames([]); // Reset state
		setGameImages({}); // Clear images
	};



	const navigate = useNavigate();
	const [games, setGames] = useState(() => {
		// Load games from localStorage or use an empty array
		return JSON.parse(localStorage.getItem("games")) || [];
	});

	const [gameImages, setGameImages] = useState(() => {
		return JSON.parse(localStorage.getItem("gameImages")) || {};
	});

	const [showModal, setShowModal] = useState(false);
	const [newGameId, setNewGameId] = useState("");

	// Fetch game icons when the component loads or when games change
	useEffect(() => {
		if (games.length === 0) return;

		async function fetchGameIcons() {
			try {
				const gameIds = games.map((game) => game.id).join(",");
				const response = await fetch(
					`https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=${gameIds}&returnPolicy=PlaceHolder&size=512x512&format=Webp&isCircular=false`
				);
				const data = await response.json();

				if (data.data) {
					const newImageMap = {};
					let cacheUpdated = false;

					data.data.forEach((item) => {
						const gameId = item.targetId;
						const newImageUrl = item.imageUrl;

						if (gameImages[gameId] !== newImageUrl) {
							cacheUpdated = true;
						}
						newImageMap[gameId] = newImageUrl;
					});

					if (cacheUpdated) {
						setGameImages(newImageMap);
						localStorage.setItem("gameImages", JSON.stringify(newImageMap));
					}
				}
			} catch (error) {
				console.error("Failed to fetch game icons:", error);
			}
		}

		fetchGameIcons();
	}, [games]);

	// Function to add a new game
	const addGame = () => {
		if (!newGameId) return alert("Please enter a game ID");

		// Add the new game and update state
		const updatedGames = [...games, { id: newGameId }];
		setGames(updatedGames);
		localStorage.setItem("games", JSON.stringify(updatedGames)); // Persist in localStorage

		setNewGameId(""); // Clear input field
		setShowModal(false); // Close modal
	};

	return (
		<div className="gameContainer">
			{games.map((game, index) => (
				<div
					key={index}
					className="gameButton"
					onClick={() => navigate(`/game/${game.id}`)}
					onDoubleClick={() => window.location.href = `roblox://experiences/start?placeId=${game.id}`}
					role="button"
					tabIndex={0}
				>
					<img
						src={gameImages[game.id] || "https://via.placeholder.com/512"}
						alt={`Game ${index + 1}`}
						loading="lazy"
					/>
				</div>
			))}

			{/* Add Game Button */}
			<div className="gameButton" onClick={() => setShowModal(true)} role="button">
				<img src="/addGame.svg" alt="Add a game" loading="lazy"/>
			</div>

			<div>
				<button onClick={clearGames}>Clear All Games</button>
			</div>

			{/* Modal for Adding a Game */}
			{showModal && (
				<div className="modal">
					<div className="modal-content">
						<h3>Add New Game</h3>
						<input
							type="text"
							value={newGameId}
							onChange={(e) => setNewGameId(e.target.value)}
							placeholder="Enter Game ID"
						/>
						<button onClick={addGame}>Add</button>
						<button onClick={() => setShowModal(false)}>Cancel</button>
					</div>
				</div>
			)}
		</div>
	);
}
