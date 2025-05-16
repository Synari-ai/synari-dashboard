"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "../components/sidebar"
import { WalletConnect } from "../components/wallet-connect"
import { DarkModeMemoryGraph } from "../components/dark-mode-memory-graph"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Moon,
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
// Add the useRouter import at the top with the other imports
import { useRouter } from "next/navigation"
import { useWallet } from "../providers/wallet-provider"

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

// Add the isConnected check from the wallet context in the component
export default function MemoryGraphPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [viewMode, setViewMode] = useState<"neural" | "grid">("neural")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showInactiveAgents, setShowInactiveAgents] = useState(true)
  const [showAgentConnections, setShowAgentConnections] = useState(false)
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
  const [agentTypeFilter, setAgentTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [memorySizeRange, setMemorySizeRange] = useState([0, 20000])
  const [timeWindowFilter, setTimeWindowFilter] = useState<string>("all")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoverAgent, setHoverAgent] = useState<string | null>(null)
  const [showDataFlow, setShowDataFlow] = useState(true)
  const graphRef = useRef<HTMLDivElement>(null)
  const centerX = 400
  const centerY = 300
  const radius = 200
  const router = useRouter()
  const { isConnected } = useWallet()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Store agents with their positions in state
  const [positionedAgents, setPositionedAgents] = useState<typeof sampleAgents>([])

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

  // If dark mode is enabled, render the dark mode version
  if (isDarkMode) {
    return (
      <DarkModeMemoryGraph
        onToggleTheme={toggleTheme}
        showAgentConnections={showAgentConnections}
        setShowAgentConnections={setShowAgentConnections}
        showDataFlow={showDataFlow}
        setShowDataFlow={setShowDataFlow}
      />
    )
  }

  // If not connected, show connect wallet message
  if (!isConnected) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Please connect your wallet to view the Memory Graph.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

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
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              <span className="sr-only">Toggle theme</span>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Moon className="h-4 w-4" />
              </div>
            </Button>
            <WalletConnect />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Filter Panel */}
          <Collapsible
            open={isFilterPanelOpen}
            onOpenChange={setIsFilterPanelOpen}
            className="border-r border-gray-200 bg-gray-50 h-full"
          >
            <div className="w-64 h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Filters</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="flex-1 overflow-auto p-4 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Agent Type</Label>
                  <Select value={agentTypeFilter} onValueChange={setAgentTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Autonomous Executor">Autonomous Executor</SelectItem>
                      <SelectItem value="Sentinel">Sentinel</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Enforcer">Enforcer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Idle">Idle</SelectItem>
                      <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium">Memory Size</Label>
                    <span className="text-xs text-gray-500">
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
                  <Label className="text-sm font-medium">Time Window</Label>
                  <Select value={timeWindowFilter} onValueChange={setTimeWindowFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-inactive"
                      checked={showInactiveAgents}
                      onCheckedChange={(checked) => setShowInactiveAgents(checked as boolean)}
                    />
                    <Label htmlFor="show-inactive" className="text-sm">
                      Show Inactive Agents
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-agent-connections"
                      checked={showAgentConnections}
                      onCheckedChange={(checked) => setShowAgentConnections(checked as boolean)}
                    />
                    <Label htmlFor="show-agent-connections" className="text-sm">
                      Show Agent-to-Agent Connections
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-data-flow"
                      checked={showDataFlow}
                      onCheckedChange={(checked) => setShowDataFlow(checked as boolean)}
                    />
                    <Label htmlFor="show-data-flow" className="text-sm">
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
              <h1 className="text-3xl font-bold">MCP Memory Graph</h1>
              <p className="text-gray-500 mt-1">
                Visualize the memory state and connections of active agents in the network.
              </p>
            </div>

            {/* Top Controls */}
            <div className="px-6 py-3 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefreshGraph}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Graph
                </Button>
                <Tabs defaultValue="neural" className="w-[300px]" onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="neural" className="flex items-center gap-1">
                      <Network className="h-4 w-4" />
                      Neural View
                    </TabsTrigger>
                    <TabsTrigger value="grid" className="flex items-center gap-1">
                      <Grid className="h-4 w-4" />
                      Grid View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleResetZoom}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 overflow-hidden relative">
              {viewMode === "neural" ? (
                <div
                  ref={graphRef}
                  className="w-full h-full overflow-auto bg-gray-50 p-4"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
                >
                  {/* This is a simplified representation of a graph - in a real app, you'd use a proper graph visualization library */}
                  <div className="relative w-[800px] h-[600px] mx-auto">
                    {/* Central MCP Node */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute w-48 h-48 -ml-24 -mt-24 flex flex-col items-center justify-center rounded-full border-4 border-black bg-white cursor-pointer transition-all shadow-lg z-10"
                            style={{
                              left: centerX,
                              top: centerY,
                              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                            }}
                          >
                            <div className="text-center p-2">
                              <div className="font-bold text-xl">MCP</div>
                              <div className="text-xs text-gray-500">Multi-Agent Coordination Protocol</div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
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
                            id={`path-${agent.id}-light`}
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
                          stroke="rgba(0,0,0,0.15)"
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
                                  stroke="rgba(0,0,0,0.2)"
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
                          const particleColor = isActive ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)"
                          const particleSize = isActive ? 2.5 : 1.5

                          // Generate multiple particles with different delays for a more natural flow
                          return Array.from({ length: isActive ? 3 : 1 }).map((_, index) => (
                            <DataFlowParticle
                              key={`particle-${agent.id}-${index}`}
                              pathId={`path-${agent.id}-light`}
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
                            ? "border-black bg-white shadow-lg"
                            : "border-gray-300 bg-white hover:border-gray-400"
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
                          <div className="font-bold text-sm truncate max-w-[100px] mx-auto">{agent.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[100px] mx-auto">{agent.type}</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                            <span className="text-xs">{agent.status}</span>
                          </div>
                          <div className="text-xs mt-1 text-gray-500">{agent.memorySize} tokens</div>
                        </div>
                      </div>
                    ))}

                    {/* Hover detail panel */}
                    {hoverAgent && (
                      <div
                        className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-30"
                        style={{
                          left: getAgentById(hoverAgent)!.position.x + 70,
                          top: getAgentById(hoverAgent)!.position.y - 20,
                          maxWidth: "250px",
                        }}
                      >
                        <div className="font-bold">{getAgentById(hoverAgent)!.name}</div>
                        <div className="text-sm text-gray-600">{getAgentById(hoverAgent)!.type}</div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Database className="h-3.5 w-3.5 text-gray-500" />
                            <span>{getAgentById(hoverAgent)!.memorySize} memory tokens</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            <span>Updated {getAgentById(hoverAgent)!.lastUpdate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <LinkIcon className="h-3.5 w-3.5 text-gray-500" />
                            <span>{getAgentById(hoverAgent)!.connections.length} connections</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full overflow-auto p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* MCP Card */}
                    <Card className="border-2 border-black shadow-lg col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-xl">MCP</h3>
                            <p className="text-sm text-gray-500">Multi-Agent Coordination Protocol</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <p>Central coordination protocol connecting all agents in the Synari network.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Agent Cards */}
                    {filteredAgents.map((agent) => (
                      <Card
                        key={agent.id}
                        className={`cursor-pointer transition-all ${
                          selectedAgent === agent.id ? "border-black shadow-lg" : "hover:border-gray-400"
                        }`}
                        onClick={() => handleAgentSelect(agent.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold">{agent.name}</h3>
                              <p className="text-sm text-gray-500">{agent.type}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                              <span className="text-xs text-gray-600">{agent.status}</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>Updated {agent.lastUpdate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-gray-400" />
                              <span>{agent.memorySize} tokens</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Network className="h-4 w-4 text-gray-400" />
                              <span>{agent.connections.length} connections</span>
                            </div>
                            {showDataFlow && (
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-gray-400" />
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
              className="border-t border-gray-200"
            >
              <CollapsibleTrigger asChild>
                <div className="p-2 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Memory Log Timeline</h3>
                    {selectedAgent && (
                      <Badge variant="outline" className="ml-2">
                        {getAgentById(selectedAgent)?.name}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isBottomPanelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="max-h-48 overflow-auto p-4 bg-white">
                  <div className="space-y-3">
                    {selectedAgentLogs.length > 0 ? (
                      selectedAgentLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            {log.action.includes("update") ? (
                              <RefreshCw className="h-4 w-4 text-white" />
                            ) : log.action.includes("Connection") ? (
                              <Network className="h-4 w-4 text-white" />
                            ) : log.action.includes("optimization") ? (
                              <Database className="h-4 w-4 text-white" />
                            ) : log.action.includes("Behavioral") ? (
                              <AlertTriangle className="h-4 w-4 text-white" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {log.action} - Block {log.blockNumber}
                            </div>
                            <div className="text-sm text-gray-500">{log.details}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
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
