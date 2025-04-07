"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedNumber = ({ value, format = (v) => v }) => {
  const [displayDigits, setDisplayDigits] = useState(() =>
    format(Math.round(value)).toString().split(""),
  );

  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 25,
  });

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      const rounded = Math.round(latest);
      const digits = format(rounded).toString().split("");
      setDisplayDigits(digits);
    });
    spring.set(value);
    return () => unsubscribe();
  }, [value, format, spring]);

  return (
    <div className="flex gap-[1px] overflow-hidden">
      {displayDigits.map((digit, i) => (
        <motion.span
          key={`${digit}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-3xl font-bold text-white select-none"
        >
          {digit}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedNumber;
