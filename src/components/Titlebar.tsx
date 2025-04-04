import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import "./Titlebar.css"; // Create this for styles

const Titlebar: React.FC = () => {
	const minimize = () => appWindow.minimize();
	const toggleMaximize = () => appWindow.toggleMaximize();
	const close = () => appWindow.close();

	return (
		<div data-tauri-drag-region className="titlebar">
			<div className="titlebar-button" onClick={minimize}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
					<path d="M6 12H18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			<div className="titlebar-button" onClick={toggleMaximize}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
					<path d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			<div className="titlebar-button" onClick={close}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
					<path d="M2 22L22 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M22 22L2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</div>
	);
};

export default Titlebar;
