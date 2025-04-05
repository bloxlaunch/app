import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import Game from "./components/Game/Game.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Profile from "./pages/Profile.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { useNavigate } from "react-router-dom";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const minimizeBtn = document.getElementById("titlebar-minimize");
    const maximizeBtn = document.getElementById("titlebar-maximize");
    const closeBtn = document.getElementById("titlebar-close");

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = () => appWindow.toggleMaximize();
    const handleClose = () => appWindow.close();

    minimizeBtn?.addEventListener("click", handleMinimize);
    maximizeBtn?.addEventListener("click", handleMaximize);
    closeBtn?.addEventListener("click", handleClose);

    return () => {
      minimizeBtn?.removeEventListener("click", handleMinimize);
      maximizeBtn?.removeEventListener("click", handleMaximize);
      closeBtn?.removeEventListener("click", handleClose);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="app">
      {/* Custom Titlebar */}
      <div
        data-tauri-drag-region
        className="fixed top-0 right-0 z-[99999] flex h-[50px] w-full justify-between select-none"
      >
        <div
          className="appName flex flex-row items-center gap-[7px] pl-[15px] opacity-80 [filter:saturate(0)_brightness(100%)] hover:cursor-pointer hover:opacity-100 hover:[filter:saturate(0)_brightness(100%)]"
          onClick={() => navigate("/about")}
        >
          <img className={"h-[50%]"} src="/whiteLogo.svg" alt="" />
          <span className={"appNameText text-white"}>Bloxlaunch</span>
        </div>
        <div className="titlebar-buttons">
          <div className="titlebar-button" id="titlebar-minimize">
            <img
              src="https://api.iconify.design/mdi:window-minimize.svg"
              alt="minimize"
            />
          </div>
          <div className="titlebar-button" id="titlebar-maximize">
            <img
              src="https://api.iconify.design/mdi:window-maximize.svg"
              alt="maximize"
            />
          </div>
          <div className="titlebar-button" id="titlebar-close">
            <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
          </div>
        </div>
      </div>
      <div className={"inner-app"}>
        {/* Sidebar */}
        {/*<Menubar/>*/}
        <Sidebar />

        {/* Main content */}
        <div className="content no-scrollbar rounded-[10px] rounded-tr-none border-t border-l border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pageWrapper"
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
