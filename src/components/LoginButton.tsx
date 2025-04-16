
import { Window } from "@tauri-apps/api/window"
import { Webview } from "@tauri-apps/api/webview"

const appWindow = new Window('uniqueLabel');

// alternatively, load a remote URL:
const webview = new Webview(appWindow, 'theUniqueLabel', {
	url: 'https://github.com/tauri-apps/tauri'
});

webview.once('tauri://created', function () {
	// webview successfully created
});
webview.once('tauri://error', function (e) {
	// an error happened creating the webview
});

// emit an event to the backend
await webview.emit("some-event", "data");
// listen to an event from the backend
const unlisten = await webview.listen("event-name", e => {});
unlisten();


// import { useState } from "react";
// import { Window } from "@tauri-apps/api/window";
// import { WebviewWindow } from "@tauri-apps/api/webview";
// import { invoke } from "@tauri-apps/api/core";
//
// export default function LoginButton({ onLogin }) {
// 	const [isLoggingIn, setIsLoggingIn] = useState(false);
//
// 	const openLoginWindow = async () => {
// 		setIsLoggingIn(true);
//
// 		// Create a new Tauri WebView window for the Roblox login page
// 		const loginWindow = new WebviewWindow("roblox-login", {
// 			url: "https://www.roblox.com/login",
// 			title: "Roblox Login",
// 			width: 800,
// 			height: 600,
// 			resizable: false,
// 			center: true,
// 		});
//
// 		// Detect when the WebView window is closed
// 		loginWindow.once("tauri://close-requested", async () => {
// 			console.log("🔒 Login window closed, fetching session cookie...");
//
// 			try {
// 				await invoke("fetch_roblox_cookie"); // Call Rust backend to store cookie
// 				alert("✅ Login successful! Cookie saved.");
// 				setIsLoggingIn(false);
// 				if (onLogin) onLogin(); // Notify parent component that login is successful
// 			} catch (error) {
// 				console.error("❌ Failed to fetch cookie:", error);
// 				alert("⚠️ Failed to login. Try again.");
// 				setIsLoggingIn(false);
// 			}
// 		});
// 	};
//
// 	return (
// 		<button className="loginButton" onClick={openLoginWindow} disabled={isLoggingIn}>
// 			{isLoggingIn ? "Logging in..." : "Login with Roblox"}
// 		</button>
// 	);
// }
