"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DarkModeSidebar } from "./dark-mode-sidebar"
import { DarkModeWalletConnect } from "./dark-mode-wallet-connect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LayoutGrid,
  List,
  Search,
  Sun,
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

export function DarkModeAgentExplorer({ onToggleTheme }: { onToggleTheme: () => void }) {
  const router = useRouter()
  const { isConnected } = useWallet()

  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [agentTypeFilter, setAgentTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastActive")
  const [currentPage, setCurrentPage] = useState(1)

  // Add the disconnected state check
  if (!isConnected) {
    return (
      <div className="flex h-screen bg-[#0B0E11]">
        <DarkModeSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md bg-[#141517] border-[#2A2D32]">
            <CardHeader>
              <CardTitle className="text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-[#A3A3A3]">
                Please connect your wallet to view the Agent Explorer.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")} className="bg-white text-[#141517] hover:bg-white/90">
                Back to Dashboard
              </Button>
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
        return "text-green-400"
      case "Expanding":
        return "text-blue-400"
      case "Corrupted":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="flex h-screen bg-[#0B0E11] text-[#A3A3A3]">
      <DarkModeSidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-4">
          {/* Header with theme toggle and wallet */}
          <div className="flex justify-end items-center mb-6 py-2">
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

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Agent Explorer</h1>
            <p className="text-[#A3A3A3] mt-2">Search and manage all deployed agents across networks.</p>
          </div>

          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A3A3A3] h-4 w-4" />
              <Input
                placeholder="Search by name, type, or address"
                className="pl-10 bg-[#141517] border-[#2A2D32] text-white focus-visible:ring-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={agentTypeFilter} onValueChange={setAgentTypeFilter}>
                <SelectTrigger className="w-[140px] bg-[#141517] border-[#2A2D32] text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Agent Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Autonomous Executor">Autonomous Executor</SelectItem>
                  <SelectItem value="Sentinel">Sentinel</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Enforcer">Enforcer</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] bg-[#141517] border-[#2A2D32] text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Idle">Idle</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger className="w-[120px] bg-[#141517] border-[#2A2D32] text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Network" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                </SelectContent>
              </Select>

              <Select value="all" onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="w-[120px] bg-[#141517] border-[#2A2D32] text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="MCP Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="isolated">Isolated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] bg-[#141517] border-[#2A2D32] text-white">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                  <SelectItem value="lastActive">Last Active</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-[#A3A3A3]">{filteredAgents.length} agents found</div>
            <div className="flex items-center gap-2 border border-[#2A2D32] rounded-md p-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-2 ${viewMode === "card" ? "bg-white text-[#141517]" : "text-white hover:bg-[#2A2D32]"}`}
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-2 ${viewMode === "table" ? "bg-white text-[#141517]" : "text-white hover:bg-[#2A2D32]"}`}
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
              <div className="w-16 h-16 bg-[#2A2D32] rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-[#A3A3A3]" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">No agents found</h3>
              <p className="text-[#A3A3A3] mb-6 max-w-md">
                No agents match your current filters. Try adjusting your search criteria or deploy a new agent.
              </p>
              <Button
                onClick={() => router.push("/create-agent")}
                className="bg-white text-[#141517] hover:bg-white/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deploy New Agent
              </Button>
            </div>
          )}

          {/* Card View */}
          {viewMode === "card" && filteredAgents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {paginatedAgents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden bg-[#141517] border-[#2A2D32]">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-[#2A2D32]">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                        <Badge variant="outline" className="ml-2 border-[#2A2D32] text-white">
                          {agent.network}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-[#2A2D32] text-white hover:bg-[#2A2D32]">
                          {agent.type}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-xs text-[#A3A3A3]">{agent.status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-[#A3A3A3] flex flex-col gap-1">
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
                          <span className="text-xs text-[#A3A3A3] flex items-center">
                            <Network className="h-3 w-3 mr-1" />
                            MCP Linked
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0B0E11] flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#2A2D32] text-white hover:bg-[#2A2D32] hover:text-white"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Logs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#2A2D32] text-white hover:bg-[#2A2D32] hover:text-white"
                      >
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
                <TableHeader className="bg-[#141517]">
                  <TableRow className="border-[#2A2D32] hover:bg-[#2A2D32]">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Last Action</TableHead>
                    <TableHead className="text-white">Memory</TableHead>
                    <TableHead className="text-white">MCP Status</TableHead>
                    <TableHead className="text-white">Network</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <TableRow key={agent.id} className="border-[#2A2D32] hover:bg-[#141517]">
                      <TableCell className="font-medium text-white">{agent.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-[#2A2D32] text-white hover:bg-[#2A2D32]">
                          {agent.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-[#A3A3A3]">{agent.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#A3A3A3]">
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
                        <span className="flex items-center text-xs text-[#A3A3A3]">
                          <Network className="h-3 w-3 mr-1 text-green-400" />
                          Linked
                        </span>
                      </TableCell>
                      <TableCell className="text-[#A3A3A3]">{agent.network}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3A3A3] hover:text-white hover:bg-[#2A2D32]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3A3A3] hover:text-white hover:bg-[#2A2D32]"
                          >
                            <StopCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A3A3A3] hover:text-white hover:bg-[#2A2D32]"
                          >
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
              <div className="text-sm text-[#A3A3A3]">
                Showing {(currentPage - 1) * agentsPerPage + 1} to{" "}
                {Math.min(currentPage * agentsPerPage, filteredAgents.length)} of {filteredAgents.length} agents
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-[#2A2D32] text-white hover:bg-[#2A2D32] hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-[#2A2D32] text-white hover:bg-[#2A2D32] hover:text-white disabled:opacity-50"
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
