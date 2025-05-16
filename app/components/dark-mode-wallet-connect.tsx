"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "../providers/wallet-provider"
import { Loader2, Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DarkModeWalletConnect() {
  const { connect, disconnect, isConnecting, isConnected, address, ensName, balance, agentsDeployed } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (isConnected) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 bg-[#141517] border-[#2A2D32] text-white hover:bg-[#2A2D32] hover:text-white"
          >
            <Wallet className="h-4 w-4" />
            {ensName || address?.substring(0, 6) + "..." + address?.substring(address.length - 4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-[#141517] border-[#2A2D32] text-white">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#2A2D32]" />
          <div className="px-2 py-1.5 text-xs font-mono text-[#A3A3A3]">{address}</div>
          <DropdownMenuSeparator className="bg-[#2A2D32]" />
          <div className="grid grid-cols-2 gap-4 p-2 text-center">
            <div>
              <div className="text-[#A3A3A3] text-xs">$SYN</div>
              <div className="text-lg font-bold text-white">{balance}</div>
            </div>
            <div>
              <div className="text-[#A3A3A3] text-xs">Agents dep.</div>
              <div className="text-lg font-bold text-white">{agentsDeployed}</div>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-[#2A2D32]" />
          <DropdownMenuItem onClick={disconnect} className="hover:bg-[#2A2D32] focus:bg-[#2A2D32]">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} disabled={isConnecting} className="gap-2 bg-white text-[#141517] hover:bg-white/90">
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
