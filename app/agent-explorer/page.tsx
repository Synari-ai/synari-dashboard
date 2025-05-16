"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "../components/sidebar"
import { WalletConnect } from "../components/wallet-connect"
import { DarkModeAgentExplorer } from "../components/dark-mode-agent-explorer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LayoutGrid,
  List,
  Search,
  Moon,
  Filter,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Eye,
  StopCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Network,
} from "lucide-react"
import { useWallet } from "../providers/wallet-provider"

// Sample agent data
const sampleAgents = [
  {
    id: "1",
    name: "YIELD BOT",
    type: "Autonomous Executor",
    status: "Active",
    lastAction: {
      name: "rebalance()",
      time: "8m ago",
      icon: <RefreshCw className="h-3 w-3" />,
    },
    memoryState: "Stable",
    network: "Ethereum",
  },
  {
    id: "2",
    name: "Price Monitor",
    type: "Sentinel",
    status: "Active",
    lastAction: {
      name: "checkPrice()",
      time: "12m ago",
      icon: <Search className="h-3 w-3" />,
    },
    memoryState: "Expanding",
    network: "Base",
  },
  {
    id: "3",
    name: "Risk Analyzer",
    type: "Analyst",
    status: "Idle",
    lastAction: {
      name: "analyzeRisk()",
      time: "1h ago",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    memoryState: "Stable",
    network: "Ethereum",
  },
  {
    id: "4",
    name: "Policy Guard",
    type: "Enforcer",
    status: "Error",
    lastAction: {
      name: "validateTx()",
      time: "3h ago",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    memoryState: "Corrupted",
    network: "Local",
  },
  {
    id: "5",
    name: "Custom Bot",
    type: "Custom",
    status: "Active",
    lastAction: {
      name: "execute()",
      time: "30m ago",
      icon: <RefreshCw className="h-3 w-3" />,
    },
    memoryState: "Expanding",
    network: "Base",
  },
  {
    id: "6",
    name: "Market Watcher",
    type: "Sentinel",
    status: "Idle",
    lastAction: {
      name: "scanMarket()",
      time: "45m ago",
      icon: <Search className="h-3 w-3" />,
    },
    memoryState: "Stable",
    network: "Ethereum",
  },
  {
    id: "7",
    name: "Liquidity Manager",
    type: "Autonomous Executor",
    status: "Active",
    lastAction: {
      name: "adjustLiquidity()",
      time: "15m ago",
      icon: <RefreshCw className="h-3 w-3" />,
    },
    memoryState: "Stable",
    network: "Base",
  },
  {
    id: "8",
    name: "Governance Bot",
    type: "Analyst",
    status: "Active",
    lastAction: {
      name: "analyzeProposal()",
      time: "2h ago",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    memoryState: "Expanding",
    network: "Ethereum",
  },
]

export default function AgentExplorerPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [agentTypeFilter, setAgentTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastActive")
  const [currentPage, setCurrentPage] = useState(1)
  const { isConnected } = useWallet()
  const router = useRouter()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // If dark mode is enabled, render the dark mode version
  if (isDarkMode) {
    return <DarkModeAgentExplorer onToggleTheme={toggleTheme} />
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
              <CardDescription>Please connect your wallet to view the Agent Explorer.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Filter and sort agents
  const filteredAgents = sampleAgents.filter((agent) => {
    // Search filter
    if (
      searchQuery &&
      !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !agent.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Agent type filter
    if (agentTypeFilter !== "all" && agent.type !== agentTypeFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && agent.status !== statusFilter) {
      return false
    }

    // Network filter
    if (networkFilter !== "all" && agent.network !== networkFilter) {
      return false
    }

    return true
  })

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "created":
        // In a real app, we'd sort by creation date
        return a.id.localeCompare(b.id)
      case "lastActive":
      default:
        // For demo purposes, we'll just sort by the last action time string
        return a.lastAction.time.localeCompare(b.lastAction.time)
    }
  })

  // Pagination
  const agentsPerPage = 12
  const totalPages = Math.ceil(sortedAgents.length / agentsPerPage)
  const paginatedAgents = sortedAgents.slice((currentPage - 1) * agentsPerPage, currentPage * agentsPerPage)

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

  // Get memory state color
  const getMemoryStateColor = (state: string) => {
    switch (state) {
      case "Stable":
        return "text-green-600"
      case "Expanding":
        return "text-blue-600"
      case "Corrupted":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-4">
          {/* Header with theme toggle and wallet */}
          <div className="flex justify-end items-center mb-6 py-2">
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

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Agent Explorer</h1>
            <p className="text-gray-500 mt-2">Search and manage all deployed agents across networks.</p>
          </div>

          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, type, or address"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={agentTypeFilter} onValueChange={setAgentTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Agent Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Autonomous Executor">Autonomous Executor</SelectItem>
                  <SelectItem value="Sentinel">Sentinel</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Enforcer">Enforcer</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Idle">Idle</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Network" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                </SelectContent>
              </Select>

              <Select value="all" onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="MCP Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="isolated">Isolated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">{filteredAgents.length} agents found</div>
            <div className="flex items-center gap-2 border rounded-md p-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
          </div>

          {/* No Agents Placeholder */}
          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No agents found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                No agents match your current filters. Try adjusting your search criteria or deploy a new agent.
              </p>
              <Button onClick={() => router.push("/create-agent")}>
                <Plus className="h-4 w-4 mr-2" />
                Deploy New Agent
              </Button>
            </div>
          )}

          {/* Card View */}
          {viewMode === "card" && filteredAgents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {paginatedAgents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{agent.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {agent.network}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{agent.type}</Badge>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-xs text-gray-600">{agent.status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-1">
                            {agent.lastAction.icon}
                            {agent.lastAction.name}
                          </span>
                          <span>–</span>
                          <span>{agent.lastAction.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Memory:</span>
                          <span className={getMemoryStateColor(agent.memoryState)}>{agent.memoryState}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-600 flex items-center">
                            <Network className="h-3 w-3 mr-1" />
                            MCP Linked
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Logs
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <StopCircle className="h-3 w-3 mr-1" />
                        Stop Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && filteredAgents.length > 0 && (
            <div className="mb-8 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Action</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>MCP Status</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{agent.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span>{agent.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-1">
                            {agent.lastAction.icon}
                            {agent.lastAction.name}
                          </span>
                          <span>–</span>
                          <span>{agent.lastAction.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getMemoryStateColor(agent.memoryState)}>{agent.memoryState}</TableCell>
                      <TableCell>
                        <span className="flex items-center text-xs">
                          <Network className="h-3 w-3 mr-1 text-green-500" />
                          Linked
                        </span>
                      </TableCell>
                      <TableCell>{agent.network}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <StopCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredAgents.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * agentsPerPage + 1} to{" "}
                {Math.min(currentPage * agentsPerPage, filteredAgents.length)} of {filteredAgents.length} agents
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
