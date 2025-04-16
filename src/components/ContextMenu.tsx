import { useState, useRef, useEffect } from "react";
import "./ContextMenu.css"; // Make sure to add styles

export default function ContextMenu({ visible, position, gameId, onClose }) {
	if (!visible) return null;

	return (
		<div
			className="context-menu"
			style={{ top: position.y, left: position.x }}
			onClick={onClose} // Hide menu when clicking an option
		>
			<ul>
				<li onClick={() => window.location.href = `roblox://experiences/start?placeId=${gameId}`}>
					Play Game
				</li>
				<li onClick={() => navigator.clipboard.writeText(`roblox://experiences/start?placeId=${gameId}`)}>
					Copy Link
				</li>
				<li onClick={onClose}>Close</li>
			</ul>
		</div>
	);
}
