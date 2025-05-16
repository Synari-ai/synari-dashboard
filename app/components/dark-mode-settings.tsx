"use client"
import { useRouter } from "next/navigation"
import { useWallet } from "../../app/providers/wallet-provider"
import { DarkModeWalletConnect } from "./dark-mode-wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bot, Shield } from "lucide-react"

export function DarkModeSettings() {
  const { isConnected, address } = useWallet()
  const router = useRouter()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#141517] p-4">
        <Card className="w-full max-w-md bg-[#1E1F23] border-[#2A2D32] text-white">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Please connect your wallet to access the settings page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <DarkModeWalletConnect />
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-[#2A2D32] text-white hover:bg-[#2A2D32]"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-[#141517] text-white">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account, agent defaults, and advanced MCP preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Preferences */}
          <Card className="bg-[#1E1F23] border-[#2A2D32]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-400" />
                <CardTitle>General Preferences</CardTitle>
              </div>
              <CardDescription className="mt-2 text-gray-400">
                Customize your account and interface settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-gray-300">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  placeholder="Enter your display name"
                  className="bg-[#141517] border-[#2A2D32] text-white focus:ring-offset-[#141517]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ensName" className="text-gray-300">
                  ENS Name
                </Label>
                <Input
                  id="ensName"
                  value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                  disabled
                  className="bg-[#1A1B1E] border-[#2A2D32] text-gray-400"
                />
                <p className="text-xs text-gray-500">Connected wallet address</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email (optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-[#141517] border-[#2A2D32] text-white focus:ring-offset-[#141517]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-gray-300">
                  Interface Theme
                </Label>
                <Select defaultValue="dark">
                  <SelectTrigger
                    id="theme"
                    className="bg-[#141517] border-[#2A2D32] text-white focus:ring-offset-[#141517]"
                  >
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1F23] border-[#2A2D32] text-white">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agent Defaults */}
          <Card className="bg-[#1E1F23] border-[#2A2D32]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-gray-400" />
                <CardTitle>Agent Defaults</CardTitle>
              </div>
              <CardDescription className="mt-2 text-gray-400">Set default behavior for new agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentType" className="text-gray-300">
                  Default Agent Type
                </Label>
                <Select defaultValue="sentinel">
                  <SelectTrigger
                    id="agentType"
                    className="bg-[#141517] border-[#2A2D32] text-white focus:ring-offset-[#141517]"
                  >
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1F23] border-[#2A2D32] text-white">
                    <SelectItem value="sentinel">Sentinel</SelectItem>
                    <SelectItem value="executor">Executor</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcpChannel" className="text-gray-300">
                  Default MCP Channel
                </Label>
                <Select defaultValue="standard">
                  <SelectTrigger
                    id="mcpChannel"
                    className="bg-[#141517] border-[#2A2D32] text-white focus:ring-offset-[#141517]"
                  >
                    <SelectValue placeholder="Select MCP channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1F23] border-[#2A2D32] text-white">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="secure">Secure Channel</SelectItem>
                    <SelectItem value="highBandwidth">High Bandwidth</SelectItem>
                    <SelectItem value="lowLatency">Low Latency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Default Behavior Mode</Label>
                <RadioGroup defaultValue="observing">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trading" id="dark-trading" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-trading" className="text-gray-300">
                      Trading
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="observing" id="dark-observing" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-observing" className="text-gray-300">
                      Observing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analyzing" id="dark-analyzing" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-analyzing" className="text-gray-300">
                      Analyzing
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Memory Retention Policy</Label>
                <RadioGroup defaultValue="extended">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shortTerm" id="dark-shortTerm" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-shortTerm" className="text-gray-300">
                      Short-Term
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extended" id="dark-extended" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-extended" className="text-gray-300">
                      Extended
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="persistent" id="dark-persistent" className="border-[#2A2D32] text-white" />
                    <Label htmlFor="dark-persistent" className="text-gray-300">
                      Persistent
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Settings */}
          <Card className="lg:col-span-2 bg-[#1E1F23] border-[#2A2D32]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-gray-400" />
                <CardTitle>Protocol Settings</CardTitle>
              </div>
              <CardDescription className="mt-2 text-gray-400">Configure advanced MCP protocol options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="memoryAnchoring" className="text-gray-300">
                      Enable memory anchoring to chain
                    </Label>
                    <p className="text-sm text-gray-500">
                      Store critical agent memory checkpoints on-chain for verification
                    </p>
                  </div>
                  <Switch id="memoryAnchoring" />
                </div>
                <Separator className="bg-[#2A2D32]" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="agentMutation" className="text-gray-300">
                      Allow agent mutation via prompt update
                    </Label>
                    <p className="text-sm text-gray-500">Permit agents to evolve behavior based on new instructions</p>
                  </div>
                  <Switch id="agentMutation" defaultChecked />
                </div>
                <Separator className="bg-[#2A2D32]" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="verboseLogging" className="text-gray-300">
                      Verbose MCP logging
                    </Label>
                    <p className="text-sm text-gray-500">Enable detailed protocol logs for debugging and analysis</p>
                  </div>
                  <Switch id="verboseLogging" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" className="border-[#2A2D32] text-white hover:bg-[#2A2D32]">
            Cancel
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
