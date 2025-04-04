import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";

export default function Game() {
	const { id } = useParams();
	const [gameData, setGameData] = useState(() => JSON.parse(localStorage.getItem("gameData")) || {});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchGameData() {
			try {
				setLoading(true);
				setError(null);

				// Step 1: Get Universe ID via proxy
				const universeResponse = await invoke("proxy_request", {
					url: `https://apis.roblox.com/universes/v1/places/${id}/universe`,
					method: "GET",
					body: null
				});
				const universeData = JSON.parse(universeResponse.body);
				if (!universeData.universeId) throw new Error("Failed to retrieve universe ID");

				// Step 2: Fetch game details using Universe ID via proxy
				const detailsResponse = await invoke("proxy_request", {
					url: `https://games.roblox.com/v1/games?universeIds=${universeData.universeId}`,
					method: "GET",
					body: null
				});
				const detailsData = JSON.parse(detailsResponse.body);
				if (!detailsData.data || detailsData.data.length === 0) throw new Error("No game details found");

				const gameDetails = detailsData.data[0];

				// Step 3: Fetch game icon and banner via proxy
				const [iconResponse, bannerResponse] = await Promise.all([
					invoke("proxy_request", {
						url: `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${id}&returnPolicy=PlaceHolder&size=512x512&format=Webp&isCircular=false`,
						method: "GET",
						body: null
					}),
					invoke("proxy_request", {
						url: `https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=1320x440&format=Png&isCircular=false`,
						method: "GET",
						body: null
					}),
				]);

				const iconData = JSON.parse(iconResponse.body);
				const bannerData = JSON.parse(bannerResponse.body);

				// Extract icon & banner
				const iconItem = iconData.data.find((item) => item.targetId === parseInt(id));
				const bannerItem = bannerData.data.find((item) => item.targetId === parseInt(id));

				// Update state with all game data
				const updatedGameData = {
					...gameData,
					[id]: {
						title: gameDetails.name || "Unknown Game",
						description: gameDetails.description || "No description available",
						playing: gameDetails.playing || 0,
						visits: gameDetails.visits || 0,
						maxPlayers: gameDetails.maxPlayers || "N/A",
						genre: gameDetails.genre || "Unknown",
						creator: gameDetails.creator?.name || "Unknown Creator",
						icon: iconItem?.imageUrl || "https://via.placeholder.com/512",
						banner: bannerItem?.imageUrl || "https://via.placeholder.com/1320x440",
					},
				};

				setGameData(updatedGameData);
				localStorage.setItem("gameData", JSON.stringify(updatedGameData));
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch game data:", err);
				setError(err.message);
				setLoading(false);
			}
		}

		fetchGameData();
	}, [id]);

	const renderGameUI = (message = null) => (
		<motion.div
			key={id}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="gameSection"
		>
			<div className="bannerIcon">
				<div className="bannerContainer">
					<img src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"} alt="Game Banner"
					     className="gameBanner" loading="lazy"/>
					<img src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"} alt="Game Banner"
					     className="gameBannerBack" loading="lazy"/>
				</div>
				<img src={gameData[id]?.icon || "https://via.placeholder.com/512"} alt="Game Icon" className="gameIcon"
				     loading="lazy"/>
			</div>

			<div className="bottomGame">
				<p><strong>Created by:</strong> {gameData[id]?.creator}</p>
				<p><strong>Genre:</strong> {gameData[id]?.genre}</p>
				<p><strong>Players Online:</strong> {gameData[id]?.playing}</p>
				<p><strong>Total Visits:</strong> {gameData[id]?.visits}</p>
				<p><strong>Max Players:</strong> {gameData[id]?.maxPlayers}</p>
				<p>{gameData[id]?.description}</p>
				<br/>
				{message && <p><strong>{message}</strong></p>}
			</div>

			<img src={gameData[id]?.banner || "https://via.placeholder.com/1320x440"} alt="Game Banner"
			     className="gameBackground" loading="lazy"/>
		</motion.div>
	);

	return (
		<AnimatePresence mode="wait">
			{loading ? renderGameUI("Loading game...") : error ? renderGameUI("Error: Please try again in 30 seconds.") : renderGameUI()}
		</AnimatePresence>
	);
}
