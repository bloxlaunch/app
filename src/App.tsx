import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import Menubar from "./components/Menubar/Menubar.tsx";
import Game from "../src/components/Game/Game.tsx"

import { AnimatePresence } from "motion/react"

export default function App() {



  return (
    <div className="app">
      <Menubar/> {/* Sidebar always visible */}
      <Sidebar/> {/* Sidebar always visible */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/game/:id" element={<Game/>}/>
        </Routes>

      </div>
    </div>
  );
}


// roblox://experiences/start?placeId=9872472334
