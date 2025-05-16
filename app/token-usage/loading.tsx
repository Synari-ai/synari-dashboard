import { Sidebar } from "../components/sidebar"
import { DarkModeSidebar } from "../components/dark-mode-sidebar"
import { WalletConnect } from "../components/wallet-connect"
import { DarkModeWalletConnect } from "../components/dark-mode-wallet-connect"

export default function Loading() {
  return (
    <div className="flex h-screen bg-white">
      {/* Light Mode (default) */}
      <div className="block dark:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden block dark:hidden">
        <header className="h-16 border-b border-gray-200 flex items-center justify-end px-6">
          <WalletConnect />
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>

            <div className="h-80 bg-gray-200 rounded mb-8"></div>

            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="hidden dark:block">
        <DarkModeSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden hidden dark:block bg-[#0F1012]">
        <header className="h-16 border-b border-[#2A2D32] flex items-center justify-end px-6">
          <DarkModeWalletConnect />
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2A2D32] rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-[#2A2D32] rounded w-1/2 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-32 bg-[#2A2D32] rounded"></div>
              <div className="h-32 bg-[#2A2D32] rounded"></div>
              <div className="h-32 bg-[#2A2D32] rounded"></div>
            </div>

            <div className="h-80 bg-[#2A2D32] rounded mb-8"></div>

            <div className="h-96 bg-[#2A2D32] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
