import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getVersion, getName } from "@tauri-apps/api/app";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { GrInstallOption } from "react-icons/gr";
import type { Update } from "@tauri-apps/plugin-updater";

const isDev = import.meta.env.DEV;

export default function Titlebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [version, setVersion] = useState("");
  const [updateInfo, setUpdateInfo] = useState<Update | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Version + updater
  useEffect(() => {
    getVersion().then(setVersion);

    (async () => {
      try {
        const update = await check();

        if (update) {
          setUpdateInfo(update);
          console.log(`🔔 Update available: ${update.version}`);
        } else {
          console.log("✅ No update available");
        }
      } catch (err) {
        console.error("❌ Failed to check for updates", err);
      }
    })();
  }, []);

  // Titlebar button events
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

  async function installUpdate() {
    if (!updateInfo) return;

    try {
      setDownloading(true);
      let downloaded = 0;
      let contentLength = 0;

      await updateInfo.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 0;
            console.log(`⬇️ Started downloading ${contentLength} bytes`);
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            console.log(`⬇️ Downloaded ${downloaded} of ${contentLength}`);
            break;
          case "Finished":
            console.log("✅ Download finished");
            break;
        }
      });

      console.log("✅ Update installed, restarting...");
      await relaunch();
    } catch (e) {
      console.error("❌ Failed to download update", e);
      setDownloading(false);
    }
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
        <img className="h-[50%]" src="/whiteLogo.svg" alt="" />
        {isDev ? (
          <span className="appNameText text-white">Bloxlaunch v{version}</span>
        ) : (
          <span className="appNameText text-white">Bloxlaunch v{version}</span>
        )}
      </div>

      {updateInfo && !downloading && (
        <button
          onClick={installUpdate}
          className="m-auto flex h-8 cursor-pointer content-center items-center gap-2 rounded-lg border border-transparent bg-[#ffb900] px-4 py-3 align-middle text-base font-medium text-black shadow transition-colors duration-150 focus:outline-none"
        >
          <GrInstallOption /> Update Available
        </button>
      )}

      {downloading && (
        <button className="m-auto flex h-8 items-center justify-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-700 shadow">
          Downloading...
        </button>
      )}

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
