import { useEffect, useRef, useState } from "react";

export default function ParallaxImage({
  src,
  alt,
  className,
  speed = -0.2,
  scrollContainer,
}) {
  const [offsetY, setOffsetY] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    const container = scrollContainer?.current || window;

    const handleScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const scrollY =
          container === window ? window.scrollY : container.scrollTop;
        setOffsetY(scrollY);
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [scrollContainer]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        transform: `translateY(${offsetY * speed}px)`,
        willChange: "transform",
      }}
    />
  );
}
