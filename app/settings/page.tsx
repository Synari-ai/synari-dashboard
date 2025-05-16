import { Sidebar } from "../components/sidebar"
import { DarkModeSidebar } from "../components/dark-mode-sidebar"
import { SettingsPage } from "./settings-page"
import { DarkModeSettings } from "../components/dark-mode-settings"
import { cookies } from "next/headers"

export default function Settings() {
  const cookieStore = cookies()
  const theme = cookieStore.get("theme")
  const isDarkMode = theme?.value === "dark"

  return (
    <div className="flex h-screen">
      {isDarkMode ? <DarkModeSidebar /> : <Sidebar />}
      <div className="flex-1 overflow-auto">{isDarkMode ? <DarkModeSettings /> : <SettingsPage />}</div>
    </div>
  )
}
