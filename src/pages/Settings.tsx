import "./page.css";
import { motion } from "framer-motion";

export default function Settings() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="page"
		>
			<h1>Settings</h1>
		</motion.div>
	);
}
