"use client";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import Game from "./components/Game/Game.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Profile from "./pages/Profile.tsx";
import Help from "./pages/Help.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
// import { Toaster } from "react-hot-toast";
import { Toaster, toast } from "sonner";

import { useNavigate } from "react-router-dom";
import Titlebar from "./components/Titlebar.tsx";
import Menubar from "./components/Menubar/Menubar.tsx";

import { setActivity, clearActivity, destroy, start } from "tauri-plugin-drpc";
import { Activity, Assets, Timestamps } from "tauri-plugin-drpc/activity";

export default function App() {
  const location = useLocation();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // start (or restart) the RPC thread
      await start("1357957770049224774");

      // build your Assets object
      const assets = new Assets().setLargeImage("bloxlaunchicon");
      // .setLargeText("Large image hovered!")
      // .setSmallImage("bloxlaunchicon")
      // .setSmallText("Small image hovered!");

      // build a single Activity instance
      const activity = new Activity()
        .setAssets(assets)
        // .setState("example string")
        // .setDetails("hello")
        .setTimestamps(new Timestamps(Date.now()));

      // push it to Discord
      await setActivity(activity);
    })();
  }, []);

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

  return (
    <div className="app">
      {/* Custom Titlebar */}
      <Titlebar />
      {/*<Toaster position="bottom-right" reverseOrder={false} />*/}
      <Toaster
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.4)",
            color: "white",
            backdropFilter: "blur(5px)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      />
      <div className={"inner-app"}>
        {/* Sidebar */}

        {/*{import.meta.env.DEV && <Menubar />}*/}
        <Sidebar />

        {/* Main content */}
        <div
          ref={scrollRef}
          className="content no-scrollbar rounded-xl rounded-tr-none border-t border-l border-white/10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className=""
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/game/:id"
                  element={<Game scrollContainer={scrollRef} />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
