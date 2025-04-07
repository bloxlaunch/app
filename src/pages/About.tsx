import "./page.css";
import { motion } from "framer-motion";

import { File } from "lucide-react";
import {
  FaFeatherAlt,
  FaUser,
  FaGithub,
  FaQuestion,
  FaWindows,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoImage } from "react-icons/io5";
import { PiWindowsLogo } from "react-icons/pi";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="page"
    >
      <div className="bg-gradient-image absolute top-0 left-0 -z-10 h-[400px] w-full bg-cover bg-center bg-no-repeat hue-rotate-180 saturate-200 sm:h-[400px] md:h-[600px] lg:h-[800px]" />
      <div className="container mx-auto flex flex-col items-center p-5">
        <img
          className="pt-15"
          src="/Bloxlaunch-Logo.svg"
          alt="Bloxlaunch Logo"
        />
        <h1 className="px-2 text-4xl font-medium">Version 0.2.0</h1>
        <p>Play your favourite Roblox games instantly</p>
      </div>
    </motion.div>
  );
}
