"use client"
import { useRouter } from "next/navigation"
import { useWallet } from "../../app/providers/wallet-provider"
import { WalletConnect } from "../components/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bot, Shield } from "lucide-react"

export function SettingsPage() {
  const { isConnected, address } = useWallet()
  const router = useRouter()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access the settings page.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <WalletConnect />
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account, agent defaults, and advanced MCP preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-500" />
                <CardTitle>General Preferences</CardTitle>
              </div>
              <CardDescription className="mt-2">Customize your account and interface settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" placeholder="Enter your display name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ensName">ENS Name</Label>
                <Input id="ensName" value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""} disabled />
                <p className="text-xs text-gray-500">Connected wallet address</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Interface Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agent Defaults */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-gray-500" />
                <CardTitle>Agent Defaults</CardTitle>
              </div>
              <CardDescription className="mt-2">Set default behavior for new agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentType">Default Agent Type</Label>
                <Select defaultValue="sentinel">
                  <SelectTrigger id="agentType">
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sentinel">Sentinel</SelectItem>
                    <SelectItem value="executor">Executor</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcpChannel">Default MCP Channel</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="mcpChannel">
                    <SelectValue placeholder="Select MCP channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="secure">Secure Channel</SelectItem>
                    <SelectItem value="highBandwidth">High Bandwidth</SelectItem>
                    <SelectItem value="lowLatency">Low Latency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Behavior Mode</Label>
                <RadioGroup defaultValue="observing">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trading" id="trading" />
                    <Label htmlFor="trading">Trading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="observing" id="observing" />
                    <Label htmlFor="observing">Observing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analyzing" id="analyzing" />
                    <Label htmlFor="analyzing">Analyzing</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Memory Retention Policy</Label>
                <RadioGroup defaultValue="extended">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shortTerm" id="shortTerm" />
                    <Label htmlFor="shortTerm">Short-Term</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extended" id="extended" />
                    <Label htmlFor="extended">Extended</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="persistent" id="persistent" />
                    <Label htmlFor="persistent">Persistent</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-gray-500" />
                <CardTitle>Protocol Settings</CardTitle>
              </div>
              <CardDescription className="mt-2">Configure advanced MCP protocol options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="memoryAnchoring">Enable memory anchoring to chain</Label>
                    <p className="text-sm text-gray-500">
                      Store critical agent memory checkpoints on-chain for verification
                    </p>
                  </div>
                  <Switch id="memoryAnchoring" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="agentMutation">Allow agent mutation via prompt update</Label>
                    <p className="text-sm text-gray-500">Permit agents to evolve behavior based on new instructions</p>
                  </div>
                  <Switch id="agentMutation" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="verboseLogging">Verbose MCP logging</Label>
                    <p className="text-sm text-gray-500">Enable detailed protocol logs for debugging and analysis</p>
                  </div>
                  <Switch id="verboseLogging" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
