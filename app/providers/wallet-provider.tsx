"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

type WalletContextType = {
  address: string | null
  ensName: string | null
  balance: string
  agentsDeployed: number
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.000")
  const [agentsDeployed, setAgentsDeployed] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("synari-wallet-address")
    const savedEnsName = localStorage.getItem("synari-wallet-ensName")
    const savedBalance = localStorage.getItem("synari-wallet-balance")
    const savedAgentsDeployed = localStorage.getItem("synari-agents-deployed")

    if (savedAddress) {
      setAddress(savedAddress)
      setEnsName(savedEnsName || null)
      setBalance(savedBalance || "500.000")
      setAgentsDeployed(Number(savedAgentsDeployed || "1"))
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)

      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful connection
      const mockAddress = "0x000000000000"
      const mockEnsName = "Jay.eth"
      const mockBalance = "500.000"

      setAddress(mockAddress)
      setEnsName(mockEnsName)
      setBalance(mockBalance)
      setAgentsDeployed(1)
      setIsConnected(true)

      // Save to localStorage
      localStorage.setItem("synari-wallet-address", mockAddress)
      localStorage.setItem("synari-wallet-ensName", mockEnsName)
      localStorage.setItem("synari-wallet-balance", mockBalance)
      localStorage.setItem("synari-agents-deployed", "1")

      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockEnsName} (${mockAddress})`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setEnsName(null)
    setBalance("0.000")
    setAgentsDeployed(0)
    setIsConnected(false)

    // Clear localStorage
    localStorage.removeItem("synari-wallet-address")
    localStorage.removeItem("synari-wallet-ensName")
    localStorage.removeItem("synari-wallet-balance")
    localStorage.removeItem("synari-agents-deployed")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        ensName,
        balance,
        agentsDeployed,
        isConnecting,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
