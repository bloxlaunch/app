import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { getVersion, getName } from "@tauri-apps/api/app";

const isDev = import.meta.env.DEV;

export default function Titlebar() {
  const location = useLocation();

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const minimizeBtn = document.getElementById("titlebar-minimize");
    const maximizeBtn = document.getElementById("titlebar-maximize");
    const closeBtn = document.getElementById("titlebar-close");

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = () => appWindow.toggleMaximize();
    const handleClose = () => appWindow.close();

    minimizeBtn?.addEventListener("click", handleMinimize);
    maximizeBtn?.addEventListener("click", handleMaximize);
    closeBtn?.addEventListener("click", handleClose);

    return () => {
      minimizeBtn?.removeEventListener("click", handleMinimize);
      maximizeBtn?.removeEventListener("click", handleMaximize);
      closeBtn?.removeEventListener("click", handleClose);
    };
  }, []);

  const navigate = useNavigate();

  async function showAppInfo() {
    const version = await getVersion();
    const name = await getName();
    console.log(`App: ${name}, Version: ${version}`);
  }

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 right-0 z-[99999] flex h-[50px] w-full justify-between select-none"
    >
      <div
        className="appName flex flex-row items-center gap-[7px] pl-[15px] opacity-80 [filter:saturate(0)_brightness(100%)] hover:cursor-pointer hover:opacity-100 hover:[filter:saturate(0)_brightness(100%)]"
        onClick={() => navigate("/about")}
      >
        <img className={"h-[50%]"} src="/whiteLogo.svg" alt="" />
        {isDev ? (
          <span className={"appNameText text-white"}>Bloxlaunch</span>
        ) : (
          <span className={"appNameText text-white"}>Bloxlaunch</span>
        )}
      </div>

      {/*<div className={"flex h-full items-center gap-2"}>*/}
      {/*  <img className={"h-6"} src="/currently-playing.svg" alt="" />*/}
      {/*  <span>Evade</span>*/}
      {/*</div>*/}

      <div className="titlebar-buttons">
        <div className="titlebar-button" id="titlebar-minimize">
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-maximize">
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div>
    </div>
  );
}
