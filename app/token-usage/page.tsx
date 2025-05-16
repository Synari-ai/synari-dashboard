import { Sidebar } from "../components/sidebar"
import { DarkModeSidebar } from "../components/dark-mode-sidebar"
import { WalletConnect } from "../components/wallet-connect"
import { DarkModeWalletConnect } from "../components/dark-mode-wallet-connect"
import { TokenUsagePage } from "./token-usage-page"
import { DarkModeTokenUsage } from "../components/dark-mode-token-usage"

export default function TokenUsage() {
  return (
    <div className="flex h-screen">
      {/* Light Mode (default) */}
      <div className="block dark:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden block dark:hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-end px-6">
          <WalletConnect />
        </header>
        <main className="flex-1 overflow-auto">
          <TokenUsagePage />
        </main>
      </div>

      {/* Dark Mode */}
      <div className="hidden dark:block">
        <DarkModeSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden hidden dark:block bg-[#0F1012]">
        <header className="h-16 border-b border-[#2A2D32] flex items-center justify-end px-6">
          <DarkModeWalletConnect />
        </header>
        <main className="flex-1 overflow-auto">
          <DarkModeTokenUsage />
        </main>
      </div>
    </div>
  )
}
