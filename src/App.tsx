import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import Menubar from "./components/Menubar/Menubar.tsx";
import Game from "../src/components/Game/Game.tsx";
import Home from "../src/pages/Home.tsx";
import Settings from "../src/pages/Settings.tsx";
import { AnimatePresence, motion } from "framer-motion";
import Profile from "./pages/Profile.tsx";

export default function App() {
  const location = useLocation();
  console.log("Current URL:", location.pathname);

  return (
    <div className="app">
      <Menubar />
      <Sidebar />
      <div className="content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} // Re-renders on route change
            initial={{ opacity: 0, y: 30 }} // Slide in from bottom
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }} // Slide out to top
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pageWrapper"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/game/:id" element={<Game />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
