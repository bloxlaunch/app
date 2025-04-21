import "./page.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

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
  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="page m-5 flex h-[calc(100vh-50px)] flex-col items-center justify-center"
    >
      <h1 className={"text-center font-extrabold"}>Bloxlaunch Help</h1>
    </motion.div>
  );
}
