// components/AnimatedNumber.js

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedNumber = ({ value, format = (v) => v }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 45 });
  const display = useTransform(spring, (current) =>
    format(Math.round(current)),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedNumber;
