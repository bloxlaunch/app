import "./page.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { SiRoblox } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { GrGithub } from "react-icons/gr";
import ExternalLink from "../components/ExternalLink.tsx";

export default function Home() {
  const [games, setGames] = useState(() => {
    return JSON.parse(localStorage.getItem("games")) || [];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="page m-5 flex h-[calc(100vh-50px)] flex-col items-center justify-center"
    >
      <h1 className={"text-center font-extrabold"}>Welcome to Bloxlaunch</h1>
      {games.length === 0 ? (
        <div className="mt-4 text-center text-gray-400 select-none">
          <p>You don’t have any games yet.</p>
          <p>Click "Add a Game" to get started!</p>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-400 select-none">
          <p>
            You have {games.length} game{games.length > 1 ? "s" : ""} added.
          </p>
        </div>
      )}
      <div className={"my-8 h-[1px] w-[40vw] bg-white/10"} />
      <div className={"flex flex-row items-center gap-3"}>
        <ExternalLink url="https://github.com/bloxlaunch/app">
          <GrGithub className="h-8 w-auto" />
        </ExternalLink>

        <ExternalLink url="https://www.roblox.com/communities/35826509/Bloxlaunch#!/about">
          <SiRoblox className="h-7 w-auto" />
        </ExternalLink>

        <ExternalLink url="https://discord.gg/UXPXeJWawn">
          <FaDiscord className="h-8 w-auto" />
        </ExternalLink>

        <ExternalLink url="https://x.com/bloxlaunchapp">
          <RiTwitterXFill className="h-8 w-auto" />
        </ExternalLink>
      </div>
    </motion.div>
  );
}
