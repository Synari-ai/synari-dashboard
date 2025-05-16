"use client"

import { useState } from "react"
import { DarkModeDashboard } from "./components/dark-mode-dashboard"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, LinkIcon, Activity, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "./components/line-chart"
import { useWallet } from "./providers/wallet-provider"
import { WalletConnect } from "./components/wallet-connect"
import { Sidebar } from "./components/sidebar"
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
  Moon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [year, setYear] = useState(2025)
  const { isConnected, address, ensName, balance, agentsDeployed } = useWallet()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (isDarkMode) {
    return <DarkModeDashboard onToggleTheme={toggleTheme} />
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Left Column - Token Stats and Agent Health */}
      {isConnected && (
        <div className="w-60 border-r border-gray-100 overflow-auto">
          {/* Token Stats Card */}
          <div className="p-4">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold mb-3">Token Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            $SYN Balance
                            <Info className="h-3 w-3 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pulled from connected wallet</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium">{balance}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Used This Week</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">42.5</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-green-500">
                                <TrendingUp className="h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>+12% compared to last 7d</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {/* Mini sparkline */}
                    <div className="w-full h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 w-3/4 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            Avg. Cost per Agent
                            <Info className="h-3 w-3 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total usage ÷ number of active agents</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">12.4</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-red-500">
                              <TrendingDown className="h-3 w-3" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
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
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-bold mb-3">Agent Health</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Active</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Idle</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Error</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">0</Badge>
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
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
                <span className="sr-only">Toggle theme</span>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Moon className="h-4 w-4" />
                </div>
              </Button>
              {isConnected && <WalletConnect />}
            </div>
          </div>

          {isConnected ? (
            <>
              {/* My Agents */}
              <div className="mt-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold">MY AGENTS</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <AgentCard
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
                  <AgentCard
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
                  <AgentCard
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
                    <Card className="border-dashed border-2 border-gray-300 bg-transparent h-full flex items-center justify-center cursor-pointer hover:border-black transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-gray-500 hover:text-black">
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
              <Separator className="my-5 bg-gray-200" />

              {/* Agent Activity and Recent Events */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold">AGENT ACTIVITY</h2>
                    <div className="flex gap-2 items-center">
                      <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="font-medium">{year}</span>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <Card className="border-gray-200 mb-4">
                    <CardContent className="p-6">
                      <LineChart />
                      <div className="flex justify-between mt-4 text-sm text-gray-500">
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
                  <Separator className="my-4 bg-gray-200" />

                  {/* Recent Events Feed */}
                  <div>
                    <h2 className="text-xl font-bold mb-3">RECENT EVENTS</h2>
                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3 max-h-[200px] overflow-auto">
                          <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Executor-12 executed rebalance()</div>
                              <div className="text-xs text-gray-500">Today at 14:32</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Sentinel-07 flagged anomaly in ETH:USDC</div>
                              <div className="text-xs text-gray-500">Today at 12:15</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">YIELD BOT completed daily optimization</div>
                              <div className="text-xs text-gray-500">Yesterday at 23:45</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <Search className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Data Monitor detected new protocol update</div>
                              <div className="text-xs text-gray-500">Yesterday at 18:22</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Start - Enhanced */}
                <div>
                  <h2 className="text-xl font-bold mb-3">QUICK START</h2>
                  <Card className="border-gray-100 bg-gray-50 p-4">
                    <CardContent className="p-0 space-y-3">
                      <Link href="/create-agent">
                        <QuickStartButton
                          label="DEPLOY NEW AGENT"
                          icon={<PlusSquare className="h-4 w-4" />}
                          variant="primary"
                        />
                      </Link>
                      <QuickStartButton label="RUN SIMULATION" icon={<PlaySquare className="h-4 w-4" />} />
                      <QuickStartButton label="UPLOAD PROMPT FILE" icon={<FileCode className="h-4 w-4" />} />

                      {/* Analyze Agent Logs */}
                      <QuickStartButton label="ANALYZE AGENT LOGS" icon={<BarChart2 className="h-4 w-4" />} />

                      {/* Disabled button: Mesh Explorer */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                className="w-full justify-start gap-4 bg-white hover:bg-gray-100 text-gray-400 border border-gray-200 shadow-sm cursor-not-allowed opacity-70"
                                disabled
                              >
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <Network className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>MESH EXPLORER</span>
                                  <Badge className="bg-gray-200 text-gray-600 text-xs">Coming Soon</Badge>
                                </div>
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
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
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-6">Welcome to Synari</h2>
                  <p className="text-gray-500 mb-8">Connect your wallet to access the AI agent management platform</p>
                  <WalletConnect />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentCard({ type, status, label, icon, statusText, showLogs = false, lastAction, logs }) {
  return (
    <Card className="bg-black text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="text-black">{icon}</div>
          </div>
          <div>
            <div className="font-bold">{type}</div>
            <div className="text-gray-400 text-sm mt-1">{statusText}</div>

            {/* Last Action */}
            {lastAction && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
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
            <Badge className={`w-fit ${status === "Active" ? "bg-white text-black" : "bg-gray-700 text-gray-300"}`}>
              {status}
            </Badge>

            {/* Logs count/status */}
            {logs && <Badge className="bg-gray-700 text-gray-300">{logs}</Badge>}
          </div>

          {label && <Badge className="w-fit bg-white text-black">{label}</Badge>}

          {/* Inside the AgentCard function, after the existing badges in the <div className="mt-4 flex flex-col gap-2"> section: */}
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs bg-black/5 text-white">
              Synced via MCP
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    This agent's state and memory are routed through Synari's Multi-Agent Coordination Protocol.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showLogs && (
            <Button variant="outline" className="mt-2 border-gray-600 text-black hover:bg-gray-800 hover:text-white">
              View Logs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickStartButton({ label, icon, variant = "secondary", tooltipText }) {
  const button = (
    <Button
      className={`w-full justify-start gap-4 ${
        variant === "primary"
          ? "bg-black hover:bg-black/90 text-white"
          : variant === "disabled"
            ? "bg-white hover:bg-gray-100 text-gray-400 border border-gray-200 shadow-sm cursor-not-allowed opacity-70"
            : "bg-white hover:bg-gray-100 text-black border border-gray-200 shadow-sm"
      }`}
      disabled={variant === "disabled"}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          variant === "primary" ? "bg-white" : variant === "disabled" ? "bg-gray-300" : "bg-black"
        }`}
      >
        <div className={variant === "primary" ? "text-black" : variant === "disabled" ? "text-gray-500" : "text-white"}>
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
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}
