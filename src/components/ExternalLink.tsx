// src/components/ExternalLink.tsx
import { PropsWithChildren, MouseEvent } from "react";
import { open } from "@tauri-apps/plugin-shell";

type ExternalLinkProps = {
  url: string;
  className?: string;
};

export default function ExternalLink({
  url,
  className,
  children,
}: PropsWithChildren<ExternalLinkProps>) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault(); // stay inside the app
    open(url); // launch default browser
  };

  return (
    <a
      href={url} // fallback for non‑Tauri context
      onClick={handleClick}
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
