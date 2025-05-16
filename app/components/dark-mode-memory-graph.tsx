"use client"

import { useState, useRef, useEffect } from "react"
import { DarkModeSidebar } from "./dark-mode-sidebar"
import { DarkModeWalletConnect } from "./dark-mode-wallet-connect"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sun,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Network,
  Grid,
  Clock,
  AlertTriangle,
  CheckCircle,
  Database,
  LinkIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Add the wallet check to the dark mode version of the Memory Graph page
// First, add the necessary imports if they're not already there
import { useRouter } from "next/navigation"
import { useWallet } from "../providers/wallet-provider"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample agent data for the graph
const sampleAgents = [
  {
    id: "agent-1",
    name: "YIELD BOT",
    type: "Autonomous Executor",
    status: "Active",
    memorySize: 12500,
    lastUpdate: "10 minutes ago",
    connections: ["agent-2", "agent-3", "agent-5"],
    position: { x: 0, y: 0 }, // Will be calculated dynamically
    dataFlowRate: 0.8, // 0-1 scale for animation speed
  },
  {
    id: "agent-2",
    name: "Price Monitor",
    type: "Sentinel",
    status: "Active",
    memorySize: 8200,
    lastUpdate: "5 minutes ago",
    connections: ["agent-1", "agent-4"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.7,
  },
  {
    id: "agent-3",
    name: "Risk Analyzer",
    type: "Analyst",
    status: "Idle",
    memorySize: 15800,
    lastUpdate: "1 hour ago",
    connections: ["agent-1", "agent-5"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.3,
  },
  {
    id: "agent-4",
    name: "Policy Guard",
    type: "Enforcer",
    status: "Error",
    memorySize: 5300,
    lastUpdate: "3 hours ago",
    connections: ["agent-2"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.1,
  },
  {
    id: "agent-5",
    name: "Market Watcher",
    type: "Sentinel",
    status: "Active",
    memorySize: 9700,
    lastUpdate: "15 minutes ago",
    connections: ["agent-1", "agent-3", "agent-6"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.6,
  },
  {
    id: "agent-6",
    name: "Governance Bot",
    type: "Analyst",
    status: "Active",
    memorySize: 18200,
    lastUpdate: "30 minutes ago",
    connections: ["agent-5", "agent-7"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.5,
  },
  {
    id: "agent-7",
    name: "Liquidity Manager",
    type: "Autonomous Executor",
    status: "Idle",
    memorySize: 11000,
    lastUpdate: "2 hours ago",
    connections: ["agent-6"],
    position: { x: 0, y: 0 },
    dataFlowRate: 0.2,
  },
]

// Sample memory log data
const sampleMemoryLogs = [
  {
    id: "log-1",
    agentId: "agent-1",
    action: "Memory update",
    details: "Updated price data from external oracle",
    timestamp: "2025-05-15T14:25:32Z",
    blockNumber: 1829221,
  },
  {
    id: "log-2",
    agentId: "agent-1",
    action: "Connection established",
    details: "Connected to agent-3 for risk assessment",
    timestamp: "2025-05-15T14:20:15Z",
    blockNumber: 1829210,
  },
  {
    id: "log-3",
    agentId: "agent-1",
    action: "Memory optimization",
    details: "Pruned outdated market data",
    timestamp: "2025-05-15T14:15:08Z",
    blockNumber: 1829195,
  },
  {
    id: "log-4",
    agentId: "agent-1",
    action: "Behavioral update",
    details: "Adjusted trading parameters based on market conditions",
    timestamp: "2025-05-15T14:10:45Z",
    blockNumber: 1829180,
  },
  {
    id: "log-5",
    agentId: "agent-1",
    action: "Memory expansion",
    details: "Added new trading strategy template",
    timestamp: "2025-05-15T14:05:22Z",
    blockNumber: 1829165,
  },
]

// Component for animated data flow particles
interface DataFlowParticleProps {
  pathId: string
  duration: number
  color: string
  size?: number
  delay?: number
  bidirectional?: boolean
}

function DataFlowParticle({
  pathId,
  duration,
  color,
  size = 3,
  delay = 0,
  bidirectional = true,
}: DataFlowParticleProps) {
  return (
    <>
      {/* Particle moving from MCP to agent */}
      <circle r={size} fill={color}>
        <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>

      {/* Particle moving from agent to MCP (if bidirectional) */}
      {bidirectional && (
        <circle r={size} fill={color}>
          <animateMotion
            dur={`${duration * 1.2}s`}
            begin={`${delay + duration / 3}s`}
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="1;0"
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      )}
    </>
  )
}

interface DarkModeMemoryGraphProps {
  onToggleTheme: () => void
  showAgentConnections: boolean
  setShowAgentConnections: (show: boolean) => void
  showDataFlow: boolean
  setShowDataFlow: (show: boolean) => void
}

// Then add the isConnected check in the component
export function DarkModeMemoryGraph({
  onToggleTheme,
  showAgentConnections,
  setShowAgentConnections,
  showDataFlow,
  setShowDataFlow,
}: {
  onToggleTheme: () => void
  showAgentConnections: boolean
  setShowAgentConnections: (show: boolean) => void
  showDataFlow: boolean
  setShowDataFlow: (show: boolean) => void
}) {
  const router = useRouter()
  const { isConnected } = useWallet()

  const [viewMode, setViewMode] = useState<"neural" | "grid">("neural")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showInactiveAgents, setShowInactiveAgents] = useState(true)
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
  const [agentTypeFilter, setAgentTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [memorySizeRange, setMemorySizeRange] = useState([0, 20000])
  const [timeWindowFilter, setTimeWindowFilter] = useState<string>("all")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoverAgent, setHoverAgent] = useState<string | null>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const centerX = 400
  const centerY = 300
  const radius = 200

  // Store agents with their positions in state
  const [positionedAgents, setPositionedAgents] = useState<typeof sampleAgents>([])

  // Add the disconnected state check
  if (!isConnected) {
    return (
      <div className="flex h-screen bg-gray-950">
        <DarkModeSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-400">
                Please connect your wallet to view the Memory Graph.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")} className="bg-white text-gray-900 hover:bg-gray-200">
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate positions in a radial layout
  useEffect(() => {
    const angleStep = (2 * Math.PI) / sampleAgents.length

    // Create a new array with calculated positions
    const agentsWithPositions = sampleAgents.map((agent, index) => {
      const angle = index * angleStep
      return {
        ...agent,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        },
      }
    })

    setPositionedAgents(agentsWithPositions)
  }, [centerX, radius])

  // Filter agents based on selected filters
  const filteredAgents = positionedAgents.filter((agent) => {
    // Agent type filter
    if (agentTypeFilter !== "all" && agent.type !== agentTypeFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && agent.status !== statusFilter) {
      return false
    }

    // Memory size filter
    if (agent.memorySize < memorySizeRange[0] || agent.memorySize > memorySizeRange[1]) {
      return false
    }

    // Time window filter (simplified for demo)
    if (timeWindowFilter !== "all") {
      // This is a simplified check - in a real app, you'd compare actual timestamps
      if (
        (timeWindowFilter === "24h" && agent.lastUpdate.includes("hour") && Number.parseInt(agent.lastUpdate) > 24) ||
        (timeWindowFilter === "7d" && agent.lastUpdate.includes("day") && Number.parseInt(agent.lastUpdate) > 7)
      ) {
        return false
      }
    }

    // Show/hide inactive agents
    if (!showInactiveAgents && agent.status !== "Active") {
      return false
    }

    return true
  })

  // Get agent logs for selected agent
  const selectedAgentLogs = selectedAgent
    ? sampleMemoryLogs.filter((log) => log.agentId === selectedAgent)
    : sampleMemoryLogs

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Idle":
        return "bg-yellow-500"
      case "Error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get agent by ID
  const getAgentById = (id: string) => {
    return positionedAgents.find((agent) => agent.id === id)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Handle reset zoom
  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  // Handle refresh graph
  const handleRefreshGraph = () => {
    // In a real app, this would fetch fresh data
    console.log("Refreshing graph data...")
  }

  // Handle agent selection
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId)
    setIsBottomPanelOpen(true)
  }

  // Generate a curved path between two points
  const generateCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2

    // Calculate control point by moving perpendicular to the line
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)

    // Adjust the curve intensity based on distance
    const curveIntensity = length / 8

    // Calculate perpendicular vector
    const perpX = (-dy / length) * curveIntensity
    const perpY = (dx / length) * curveIntensity

    // Control point
    const cpX = midX + perpX
    const cpY = midY + perpY

    return `M ${x1} ${y1} Q ${cpX} ${cpY}, ${x2} ${y2}`
  }

  // Calculate animation duration based on agent status and data flow rate
  const getAnimationDuration = (agent: (typeof sampleAgents)[0]) => {
    // Base duration between 5-15 seconds
    const baseDuration = 15 - agent.dataFlowRate * 10

    // Adjust based on status
    if (agent.status === "Active") {
      return baseDuration
    } else if (agent.status === "Idle") {
      return baseDuration * 2 // Slower for idle agents
    } else {
      return baseDuration * 3 // Very slow for error agents
    }
  }

  return (
    <div className="flex h-screen bg-[#0B0E11] text-[#A3A3A3]">
      <DarkModeSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggleTheme}>
              <span className="sr-only">Toggle theme</span>
              <div className="w-8 h-8 bg-[#2A2D32] rounded-full flex items-center justify-center">
                <Sun className="h-4 w-4 text-white" />
              </div>
            </Button>
            <DarkModeWalletConnect />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Filter Panel */}
          <Collapsible
            open={isFilterPanelOpen}
            onOpenChange={setIsFilterPanelOpen}
            className="border-r border-[#2A2D32] bg-[#141517] h-full"
          >
            <div className="w-64 h-full flex flex-col">
              <div className="p-4 border-b border-[#2A2D32] flex justify-between items-center">
                <h3 className="font-semibold text-white">Filters</h3>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-[#2A2D32] hover:text-white"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="flex-1 overflow-auto p-4 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Agent Type</Label>
                  <Select value={agentTypeFilter} onValueChange={setAgentTypeFilter}>
                    <SelectTrigger className="bg-[#0B0E11] border-[#2A2D32] text-white">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Autonomous Executor">Autonomous Executor</SelectItem>
                      <SelectItem value="Sentinel">Sentinel</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Enforcer">Enforcer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-[#0B0E11] border-[#2A2D32] text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Idle">Idle</SelectItem>
                      <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium text-white">Memory Size</Label>
                    <span className="text-xs text-[#A3A3A3]">
                      {memorySizeRange[0]} - {memorySizeRange[1]} tokens
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 20000]}
                    min={0}
                    max={20000}
                    step={100}
                    value={memorySizeRange}
                    onValueChange={setMemorySizeRange}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Time Window</Label>
                  <Select value={timeWindowFilter} onValueChange={setTimeWindowFilter}>
                    <SelectTrigger className="bg-[#0B0E11] border-[#2A2D32] text-white">
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-[#2A2D32]" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-inactive-dark"
                      checked={showInactiveAgents}
                      onCheckedChange={(checked) => setShowInactiveAgents(checked as boolean)}
                      className="border-[#2A2D32] data-[state=checked]:bg-white data-[state=checked]:text-[#141517]"
                    />
                    <Label htmlFor="show-inactive-dark" className="text-sm text-[#A3A3A3]">
                      Show Inactive Agents
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-agent-connections-dark"
                      checked={showAgentConnections}
                      onCheckedChange={(checked) => setShowAgentConnections(checked as boolean)}
                      className="border-[#2A2D32] data-[state=checked]:bg-white data-[state=checked]:text-[#141517]"
                    />
                    <Label htmlFor="show-agent-connections-dark" className="text-sm text-[#A3A3A3]">
                      Show Agent-to-Agent Connections
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-data-flow-dark"
                      checked={showDataFlow}
                      onCheckedChange={(checked) => setShowDataFlow(checked as boolean)}
                      className="border-[#2A2D32] data-[state=checked]:bg-white data-[state=checked]:text-[#141517]"
                    />
                    <Label htmlFor="show-data-flow-dark" className="text-sm text-[#A3A3A3]">
                      Show Data Flow Animation
                    </Label>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="p-6 pb-2">
              <h1 className="text-3xl font-bold text-white">MCP Memory Graph</h1>
              <p className="text-[#A3A3A3] mt-1">
                Visualize the memory state and connections of active agents in the network.
              </p>
            </div>

            {/* Top Controls */}
            <div className="px-6 py-3 flex flex-wrap justify-between items-center gap-4 border-b border-[#2A2D32]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshGraph}
                  className="border-[#2A2D32] bg-white text-[#141517] hover:bg-[#f0f0f0] hover:text-[#141517]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Graph
                </Button>
                <Tabs defaultValue="neural" className="w-[300px]" onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList className="grid w-full grid-cols-2 bg-[#2A2D32] text-[#A3A3A3]">
                    <TabsTrigger
                      value="neural"
                      className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-[#141517]"
                    >
                      <Network className="h-4 w-4" />
                      Neural View
                    </TabsTrigger>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-[#141517]"
                    >
                      <Grid className="h-4 w-4" />
                      Grid View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  className="border-[#2A2D32] bg-white text-[#141517] hover:bg-[#f0f0f0] hover:text-[#141517]"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleResetZoom}
                  className="border-[#2A2D32] bg-white text-[#141517] hover:bg-[#f0f0f0] hover:text-[#141517]"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  className="border-[#2A2D32] bg-white text-[#141517] hover:bg-[#f0f0f0] hover:text-[#141517]"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 overflow-hidden relative">
              {viewMode === "neural" ? (
                <div
                  ref={graphRef}
                  className="w-full h-full overflow-auto bg-[#0B0E11] p-4"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
                >
                  {/* This is a simplified representation of a graph - in a real app, you'd use a proper graph visualization library */}
                  <div className="relative w-[800px] h-[600px] mx-auto">
                    {/* Central MCP Node */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute w-48 h-48 -ml-24 -mt-24 flex flex-col items-center justify-center rounded-full border-4 border-white bg-[#141517] cursor-pointer transition-all shadow-lg z-10"
                            style={{
                              left: centerX,
                              top: centerY,
                              boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                            }}
                          >
                            <div className="text-center p-2">
                              <div className="font-bold text-xl text-white">MCP</div>
                              <div className="text-xs text-[#A3A3A3]">Multi-Agent Coordination Protocol</div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#141517] border-[#2A2D32] text-white">
                          <p>
                            This is the protocol core that synchronizes all agent memory and behavior across the Synari
                            network.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* SVG for connections and animations */}
                    <svg className="absolute inset-0 w-full h-full z-0">
                      <defs>
                        {/* Define paths for each connection for animation to follow */}
                        {filteredAgents.map((agent) => (
                          <path
                            key={`path-${agent.id}`}
                            id={`path-${agent.id}-dark`}
                            d={generateCurvedPath(centerX, centerY, agent.position.x, agent.position.y)}
                            fill="none"
                            stroke="none"
                          />
                        ))}
                      </defs>

                      {/* MCP connections to all agents */}
                      {filteredAgents.map((agent) => (
                        <path
                          key={`mcp-${agent.id}`}
                          d={generateCurvedPath(centerX, centerY, agent.position.x, agent.position.y)}
                          fill="none"
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth={3}
                          strokeDasharray={agent.status !== "Active" ? "5,5" : ""}
                        />
                      ))}

                      {/* Agent-to-agent connections (only shown if enabled) */}
                      {showAgentConnections &&
                        filteredAgents.map((agent) =>
                          agent.connections
                            .filter((connId) => {
                              const connectedAgent = getAgentById(connId)
                              return connectedAgent && filteredAgents.some((a) => a.id === connId)
                            })
                            .map((connId) => {
                              const connectedAgent = getAgentById(connId)
                              if (!connectedAgent) return null
                              return (
                                <path
                                  key={`${agent.id}-${connId}`}
                                  d={generateCurvedPath(
                                    agent.position.x,
                                    agent.position.y,
                                    connectedAgent.position.x,
                                    connectedAgent.position.y,
                                  )}
                                  fill="none"
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth={2}
                                  strokeDasharray={
                                    agent.status !== "Active" || connectedAgent.status !== "Active" ? "5,5" : ""
                                  }
                                />
                              )
                            }),
                        )}

                      {/* Data flow animations */}
                      {showDataFlow &&
                        filteredAgents.map((agent) => {
                          // Calculate animation properties based on agent status
                          const duration = getAnimationDuration(agent)
                          const isActive = agent.status === "Active"
                          const particleColor = isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"
                          const particleSize = isActive ? 2.5 : 1.5

                          // Generate multiple particles with different delays for a more natural flow
                          return Array.from({ length: isActive ? 3 : 1 }).map((_, index) => (
                            <DataFlowParticle
                              key={`particle-${agent.id}-${index}`}
                              pathId={`path-${agent.id}-dark`}
                              duration={duration + index * 2}
                              color={particleColor}
                              size={particleSize}
                              delay={index * (duration / 3)}
                              bidirectional={isActive}
                            />
                          ))
                        })}
                    </svg>

                    {/* Draw nodes on top of edges */}
                    {filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`absolute w-32 h-32 -ml-16 -mt-16 flex flex-col items-center justify-center rounded-full border-2 cursor-pointer transition-all ${
                          selectedAgent === agent.id
                            ? "border-white bg-[#141517] shadow-lg"
                            : "border-[#2A2D32] bg-[#141517] hover:border-[#A3A3A3]"
                        }`}
                        style={{
                          left: agent.position.x,
                          top: agent.position.y,
                          opacity: agent.status !== "Active" && showInactiveAgents ? 0.6 : 1,
                          zIndex: hoverAgent === agent.id ? 20 : 5,
                        }}
                        onClick={() => handleAgentSelect(agent.id)}
                        onMouseEnter={() => setHoverAgent(agent.id)}
                        onMouseLeave={() => setHoverAgent(null)}
                      >
                        <div className="text-center p-2">
                          <div className="font-bold text-sm truncate max-w-[100px] mx-auto text-white">
                            {agent.name}
                          </div>
                          <div className="text-xs text-[#A3A3A3] truncate max-w-[100px] mx-auto">{agent.type}</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                            <span className="text-xs text-[#A3A3A3]">{agent.status}</span>
                          </div>
                          <div className="text-xs mt-1 text-[#A3A3A3]">{agent.memorySize} tokens</div>
                        </div>
                      </div>
                    ))}

                    {/* Hover detail panel */}
                    {hoverAgent && (
                      <div
                        className="absolute bg-[#141517] border border-[#2A2D32] rounded-lg shadow-lg p-3 z-30"
                        style={{
                          left: getAgentById(hoverAgent)!.position.x + 70,
                          top: getAgentById(hoverAgent)!.position.y - 20,
                          maxWidth: "250px",
                        }}
                      >
                        <div className="font-bold text-white">{getAgentById(hoverAgent)!.name}</div>
                        <div className="text-sm text-[#A3A3A3]">{getAgentById(hoverAgent)!.type}</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[#A3A3A3]">
                            <Database className="h-3.5 w-3.5 text-[#A3A3A3]" />
                            <span>{getAgentById(hoverAgent)!.memorySize} memory tokens</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#A3A3A3]">
                            <Clock className="h-3.5 w-3.5 text-[#A3A3A3]" />
                            <span>Updated {getAgentById(hoverAgent)!.lastUpdate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#A3A3A3]">
                            <LinkIcon className="h-3.5 w-3.5 text-[#A3A3A3]" />
                            <span>{getAgentById(hoverAgent)!.connections.length} connections</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full overflow-auto p-4 bg-[#0B0E11]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* MCP Card */}
                    <Card className="border-2 border-white shadow-lg bg-[#141517] col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-xl text-white">MCP</h3>
                            <p className="text-sm text-[#A3A3A3]">Multi-Agent Coordination Protocol</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-[#A3A3A3]">
                          <p>Central coordination protocol connecting all agents in the Synari network.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Agent Cards */}
                    {filteredAgents.map((agent) => (
                      <Card
                        key={agent.id}
                        className={`cursor-pointer transition-all bg-[#141517] border-[#2A2D32] ${
                          selectedAgent === agent.id ? "border-white shadow-lg" : "hover:border-[#A3A3A3]"
                        }`}
                        onClick={() => handleAgentSelect(agent.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-white">{agent.name}</h3>
                              <p className="text-sm text-[#A3A3A3]">{agent.type}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                              <span className="text-xs text-[#A3A3A3]">{agent.status}</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-[#A3A3A3]">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#A3A3A3]" />
                              <span>Updated {agent.lastUpdate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-[#A3A3A3]" />
                              <span>{agent.memorySize} tokens</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Network className="h-4 w-4 text-[#A3A3A3]" />
                              <span>{agent.connections.length} connections</span>
                            </div>
                            {showDataFlow && (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-[#A3A3A3]" />
                                <span>Data flow: {Math.round(agent.dataFlowRate * 100)}%</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Panel - Memory Log Timeline */}
            <Collapsible
              open={isBottomPanelOpen}
              onOpenChange={setIsBottomPanelOpen}
              className="border-t border-[#2A2D32]"
            >
              <CollapsibleTrigger asChild>
                <div className="p-2 flex justify-between items-center bg-[#141517] cursor-pointer hover:bg-[#2A2D32]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-white">Memory Log Timeline</h3>
                    {selectedAgent && (
                      <Badge variant="outline" className="ml-2 border-[#2A2D32] text-white">
                        {getAgentById(selectedAgent)?.name}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-[#2A2D32] hover:text-white"
                  >
                    {isBottomPanelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="max-h-48 overflow-auto p-4 bg-[#0B0E11]">
                  <div className="space-y-3">
                    {selectedAgentLogs.length > 0 ? (
                      selectedAgentLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-[#141517] rounded-md">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            {log.action.includes("update") ? (
                              <RefreshCw className="h-4 w-4 text-[#141517]" />
                            ) : log.action.includes("Connection") ? (
                              <Network className="h-4 w-4 text-[#141517]" />
                            ) : log.action.includes("optimization") ? (
                              <Database className="h-4 w-4 text-[#141517]" />
                            ) : log.action.includes("Behavioral") ? (
                              <AlertTriangle className="h-4 w-4 text-[#141517]" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-[#141517]" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {log.action} - Block {log.blockNumber}
                            </div>
                            <div className="text-sm text-[#A3A3A3]">{log.details}</div>
                            <div className="text-xs text-[#A3A3A3] mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-[#A3A3A3] py-4">
                        {selectedAgent ? "No logs found for this agent" : "Select an agent to view memory logs"}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  )
}
