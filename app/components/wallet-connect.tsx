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

export function WalletConnect() {
  const { connect, disconnect, isConnecting, isConnected, address, ensName, balance, agentsDeployed } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (isConnected) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {ensName || address?.substring(0, 6) + "..." + address?.substring(address.length - 4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs font-mono">{address}</div>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-2 gap-4 p-2 text-center">
            <div>
              <div className="text-gray-500 text-xs">$SYN</div>
              <div className="text-lg font-bold">{balance}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Agents dep.</div>
              <div className="text-lg font-bold">{agentsDeployed}</div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} disabled={isConnecting} className="gap-2">
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
