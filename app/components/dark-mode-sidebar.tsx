"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Code, Search, Layers, Terminal, Key, Settings, LogOut } from "lucide-react"

export function DarkModeSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-60 h-screen bg-[#141517] text-white flex flex-col border-r border-[#2A2D32]">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          {/* Simple text logo */}
          <span className="text-2xl font-bold tracking-tight">SYNARI</span>
        </Link>
      </div>

      <nav className="flex-1 mt-6">
        <NavItem href="/" icon={<Home size={20} />} label="Dashboard" active={pathname === "/"} />
        <NavItem
          href="/create-agent"
          icon={<Code size={20} />}
          label="Create Agent"
          active={pathname === "/create-agent"}
        />
        <NavItem
          href="/agent-explorer"
          icon={<Search size={20} />}
          label="Agent Explorer"
          active={pathname === "/agent-explorer"}
        />
        <NavItem
          href="/memory-graph"
          icon={<Layers size={20} />}
          label="Memory Graph"
          active={pathname === "/memory-graph"}
        />
        <NavItem href="/console" icon={<Terminal size={20} />} label="Console" active={pathname === "/console"} />
        <NavItem
          href="/token-usage"
          icon={<Key size={20} />}
          label="Token Usage"
          active={pathname === "/token-usage"}
        />
      </nav>

      <div className="mt-auto mb-6">
        <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" active={pathname === "/settings"} />
        <div className="flex items-center gap-3 px-6 py-3 text-[#A3A3A3] hover:text-white cursor-pointer">
          <div className="w-6 flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="font-medium">Log Out</span>
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label, active = false }) {
  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center gap-3 px-6 py-3 ${
          active ? "bg-[#2A2D32] text-white rounded-r-full" : "text-[#A3A3A3] hover:text-white"
        }`}
      >
        <div className="w-6 flex items-center justify-center">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  )
}
