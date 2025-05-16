"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, LinkIcon, Activity, Plus, Wallet, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "../providers/wallet-provider"
import { DarkModeSidebar } from "./dark-mode-sidebar"
import {
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Network,
  PlusSquare,
  PlaySquare,
  FileCode,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Info,
  Sun,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DarkModeDashboard({ onToggleTheme }) {
  const [year, setYear] = useState(2025)
  const { isConnected, address, ensName, balance, agentsDeployed } = useWallet()

  return (
    <div className="flex h-screen bg-[#0B0E11] text-[#A3A3A3]">
      <DarkModeSidebar />

      {/* Left Column - Token Stats and Agent Health */}
      {isConnected && (
        <div className="w-60 border-r border-[#2A2D32] overflow-auto">
          {/* Token Stats Card */}
          <div className="p-4">
            <Card className="mb-4 bg-[#141517] border-[#2A2D32]">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold mb-3 text-white">Token Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[#A3A3A3] text-xs flex items-center gap-1">
                            $SYN Balance
                            <Info className="h-3 w-3 text-[#A3A3A3]" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                          <p>Pulled from connected wallet</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium text-white">{balance}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A3A3A3] text-xs">Used This Week</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-white">42.5</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-white">
                                <TrendingUp className="h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                              <p>+12% compared to last 7d</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {/* Mini sparkline */}
                    <div className="w-full h-1 bg-[#2A2D32] mt-1 rounded-full overflow-hidden">
                      <div className="h-full bg-[#A3A3A3] w-3/4 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-[#A3A3A3] text-xs flex items-center gap-1">
                            Avg. Cost per Agent
                            <Info className="h-3 w-3 text-[#A3A3A3]" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                          <p>Total usage ÷ number of active agents</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-white">12.4</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-white">
                              <TrendingDown className="h-3 w-3" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                            <p>-5% compared to last 7d</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Health Overview */}
            <Card className="bg-[#141517] border-[#2A2D32]">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold mb-3 text-white">Agent Health</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#A3A3A3]">Active</span>
                    </div>
                    <Badge className="bg-[#2A2D32] text-white hover:bg-[#2A2D32]">2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#A3A3A3]">Idle</span>
                    </div>
                    <Badge className="bg-[#2A2D32] text-white hover:bg-[#2A2D32]">1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-white" />
                      <span className="text-sm text-[#A3A3A3]">Error</span>
                    </div>
                    <Badge className="bg-[#2A2D32] text-white hover:bg-[#2A2D32]">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-4">
          {/* Header */}
          <div className="flex justify-end items-center mb-6 py-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggleTheme}>
                <span className="sr-only">Toggle theme</span>
                <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center">
                  <Sun className="h-4 w-4 text-white" />
                </div>
              </Button>
              {isConnected && <DarkModeWalletConnect />}
            </div>
          </div>

          {isConnected ? (
            <>
              {/* My Agents */}
              <div className="mt-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-white">MY AGENTS</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2D32]">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2D32]">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <DarkModeAgentCard
                    type="MARKET MAKER"
                    status="Active"
                    label="YIELD BOT"
                    icon={<LinkIcon className="h-5 w-5" />}
                    statusText="Trading"
                    lastAction={{
                      name: "rebalance()",
                      time: "6 min ago",
                      icon: <RefreshCw className="h-3 w-3" />,
                    }}
                    logs="5 Events"
                  />
                  <DarkModeAgentCard
                    type="Data Monitor"
                    status="Idle"
                    icon={<Search className="h-5 w-5" />}
                    statusText="Observing"
                    showLogs
                    lastAction={{
                      name: "checkPrice()",
                      time: "12 min ago",
                      icon: <Search className="h-3 w-3" />,
                    }}
                    logs="2 Events"
                  />
                  <DarkModeAgentCard
                    type="Data Monitor"
                    status="Idle"
                    icon={<Activity className="h-5 w-5" />}
                    statusText="Analyzing"
                    showLogs
                    lastAction={{
                      name: "updateConfig()",
                      time: "1 hr ago",
                      icon: <Settings className="h-3 w-3" />,
                    }}
                    logs="Logs: Active"
                  />
                  <Link href="/create-agent" className="block">
                    <Card className="border-dashed border-2 border-[#2A2D32] bg-transparent h-full flex items-center justify-center cursor-pointer hover:border-white transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-[#A3A3A3] hover:text-white">
                        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6" />
                        </div>
                        <span className="font-medium">Create New Agent</span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>

              {/* Divider between My Agents and Agent Activity */}
              <Separator className="my-5 bg-[#2A2D32]" />

              {/* Agent Activity and Recent Events */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white">AGENT ACTIVITY</h2>
                    <div className="flex gap-2 items-center">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2D32]">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="font-medium text-white">{year}</span>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A2D32]">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <Card className="border-[#2A2D32] bg-[#141517] mb-4">
                    <CardContent className="p-6">
                      <DarkModeLineChart />
                      <div className="flex justify-between mt-4 text-sm text-[#A3A3A3]">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Divider between Agent Activity and Recent Events */}
                  <Separator className="my-4 bg-[#2A2D32]" />

                  {/* Recent Events Feed */}
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-white">RECENT EVENTS</h2>
                    <Card className="border-[#2A2D32] bg-[#141517]">
                      <CardContent className="p-4">
                        <div className="space-y-3 max-h-[200px] overflow-auto">
                          <div className="flex items-start gap-3 p-2 hover:bg-[#0B0E11] rounded-md">
                            <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center flex-shrink-0">
                              <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">Executor-12 executed rebalance()</div>
                              <div className="text-xs text-[#A3A3A3]">Today at 14:32</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-[#0B0E11] rounded-md">
                            <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">Sentinel-07 flagged anomaly in ETH:USDC</div>
                              <div className="text-xs text-[#A3A3A3]">Today at 12:15</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-[#0B0E11] rounded-md">
                            <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">YIELD BOT completed daily optimization</div>
                              <div className="text-xs text-[#A3A3A3]">Yesterday at 23:45</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-[#0B0E11] rounded-md">
                            <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center flex-shrink-0">
                              <Search className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">Data Monitor detected new protocol update</div>
                              <div className="text-xs text-[#A3A3A3]">Yesterday at 18:22</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Start - Enhanced */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-white">QUICK START</h2>
                  <Card className="border-[#2A2D32] bg-[#141517] p-4">
                    <CardContent className="p-0 space-y-3">
                      <Link href="/create-agent">
                        <DarkModeQuickStartButton
                          label="DEPLOY NEW AGENT"
                          icon={<PlusSquare className="h-4 w-4" />}
                          variant="primary"
                        />
                      </Link>
                      <DarkModeQuickStartButton label="RUN SIMULATION" icon={<PlaySquare className="h-4 w-4" />} />
                      <DarkModeQuickStartButton label="UPLOAD PROMPT FILE" icon={<FileCode className="h-4 w-4" />} />

                      {/* Analyze Agent Logs */}
                      <DarkModeQuickStartButton label="ANALYZE AGENT LOGS" icon={<BarChart2 className="h-4 w-4" />} />

                      {/* Disabled button: Mesh Explorer */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                className="w-full justify-start gap-4 bg-[#141517] hover:bg-[#2A2D32] text-[#A3A3A3] border border-[#2A2D32] shadow-sm cursor-not-allowed opacity-70"
                                disabled
                              >
                                <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center">
                                  <Network className="h-4 w-4 text-[#A3A3A3]" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>MESH EXPLORER</span>
                                  <Badge className="bg-[#2A2D32] text-[#A3A3A3] text-xs">Coming Soon</Badge>
                                </div>
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                            <p>Launches agent mesh visualizer — coming soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <Card className="w-full max-w-md bg-[#141517] border-[#2A2D32]">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-6 text-white">Welcome to Synari</h2>
                  <p className="text-[#A3A3A3] mb-8">Connect your wallet to access the AI agent management platform</p>
                  <DarkModeWalletConnect />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DarkModeAgentCard({ type, status, label, icon, statusText, showLogs = false, lastAction, logs }) {
  return (
    <Card className="bg-[#141517] text-white overflow-hidden border-[#2A2D32]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#2A2D32] rounded-full flex items-center justify-center">
            <div className="text-white">{icon}</div>
          </div>
          <div>
            <div className="font-bold text-white">{type}</div>
            <div className="text-[#A3A3A3] text-sm mt-1">{statusText}</div>

            {/* Last Action */}
            {lastAction && (
              <div className="flex items-center gap-1 text-xs text-[#A3A3A3] mt-1">
                <span className="flex items-center gap-1">
                  {lastAction.icon}
                  {lastAction.name}
                </span>
                <span>–</span>
                <span>{lastAction.time}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Badge
              className={`w-fit ${status === "Active" ? "bg-white text-[#141517]" : "bg-[#2A2D32] text-[#A3A3A3]"}`}
            >
              {status}
            </Badge>

            {/* Logs count/status */}
            {logs && <Badge className="bg-[#2A2D32] text-[#A3A3A3]">{logs}</Badge>}
          </div>

          {label && <Badge className="w-fit bg-white text-[#141517]">{label}</Badge>}

          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs border-[#2A2D32] text-[#A3A3A3]">
              Synced via MCP
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-[#A3A3A3] cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <p className="max-w-xs">
                    This agent's state and memory are routed through Synari's Multi-Agent Coordination Protocol.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showLogs && (
            <Button variant="outline" className="mt-2 border-[#2A2D32] text-black hover:bg-[#2A2D32] hover:text-white">
              View Logs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DarkModeQuickStartButton({ label, icon, variant = "secondary", tooltipText }) {
  const button = (
    <Button
      className={`w-full justify-start gap-4 ${
        variant === "primary"
          ? "bg-white hover:bg-white/90 text-[#141517]"
          : variant === "disabled"
            ? "bg-[#141517] hover:bg-[#2A2D32] text-[#A3A3A3] border border-[#2A2D32] shadow-sm cursor-not-allowed opacity-70"
            : "bg-[#141517] hover:bg-[#2A2D32] text-white border border-[#2A2D32] shadow-sm"
      }`}
      disabled={variant === "disabled"}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          variant === "primary" ? "bg-[#141517]" : variant === "disabled" ? "bg-[#2A2D32]" : "bg-white"
        }`}
      >
        <div
          className={
            variant === "primary" ? "text-white" : variant === "disabled" ? "text-[#A3A3A3]" : "text-[#141517]"
          }
        >
          {icon}
        </div>
      </div>
      <span>{label}</span>
    </Button>
  )

  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent className="bg-[#141517] border-[#2A2D32] text-white">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

function DarkModeWalletConnect() {
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

function DarkModeLineChart() {
  // This is a placeholder for the dark mode line chart
  // In a real implementation, you would pass dark mode colors to the LineChart component
  return (
    <div className="h-64 w-full flex items-center justify-center">
      <div className="text-[#A3A3A3]">Chart placeholder - would use grayscale colors</div>
    </div>
  )
}
