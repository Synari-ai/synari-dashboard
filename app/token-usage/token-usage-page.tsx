"use client"

import { useState } from "react"
import { useWallet } from "../providers/wallet-provider"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, Coins, Cpu, Filter, Info, RefreshCw, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data for the chart
const chartData = [
  { name: "May 1", memory: 12, mcp: 8, compute: 5 },
  { name: "May 2", memory: 15, mcp: 10, compute: 7 },
  { name: "May 3", memory: 13, mcp: 9, compute: 6 },
  { name: "May 4", memory: 17, mcp: 12, compute: 8 },
  { name: "May 5", memory: 20, mcp: 15, compute: 10 },
  { name: "May 6", memory: 18, mcp: 13, compute: 9 },
  { name: "May 7", memory: 22, mcp: 16, compute: 11 },
]

// Sample data for the agents table
const agentsData = [
  {
    id: 1,
    name: "Governance Sentinel",
    type: "Sentinel",
    status: "Active",
    totalUsed: 182.3,
    last7d: 42.1,
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Market Analyzer",
    type: "Analyzer",
    status: "Active",
    totalUsed: 124.5,
    last7d: 31.2,
    lastActive: "15 mins ago",
  },
  {
    id: 3,
    name: "Data Collector",
    type: "Collector",
    status: "Idle",
    totalUsed: 87.9,
    last7d: 12.5,
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Policy Guard",
    type: "Guard",
    status: "Active",
    totalUsed: 65.2,
    last7d: 18.7,
    lastActive: "30 mins ago",
  },
  {
    id: 5,
    name: "Risk Assessor",
    type: "Assessor",
    status: "Error",
    totalUsed: 43.8,
    last7d: 8.2,
    lastActive: "2 days ago",
  },
  {
    id: 6,
    name: "Compliance Monitor",
    type: "Monitor",
    status: "Active",
    totalUsed: 38.1,
    last7d: 9.5,
    lastActive: "4 hours ago",
  },
]

// Sample data for raw logs
const rawLogs = [
  { timestamp: "2023-05-07 14:32:15", message: "[MCP] Agent-4 used 2.3 $SYN on memory sync @ block 1829432" },
  { timestamp: "2023-05-07 14:30:42", message: "[COMPUTE] Governance Sentinel used 1.8 $SYN for policy verification" },
  { timestamp: "2023-05-07 14:28:17", message: "[MEMORY] Market Analyzer used 0.5 $SYN for data storage" },
  { timestamp: "2023-05-07 14:25:03", message: "[MCP] Agent-2 used 1.2 $SYN on coordination @ block 1829431" },
  { timestamp: "2023-05-07 14:22:51", message: "[COMPUTE] Data Collector used 0.9 $SYN for data processing" },
  { timestamp: "2023-05-07 14:20:18", message: "[MEMORY] Policy Guard used 0.3 $SYN for rule storage" },
  { timestamp: "2023-05-07 14:18:05", message: "[MCP] Agent-6 used 1.5 $SYN on message relay @ block 1829430" },
  { timestamp: "2023-05-07 14:15:42", message: "[COMPUTE] Risk Assessor used 1.1 $SYN for risk calculation" },
]

export function TokenUsagePage() {
  const { isConnected } = useWallet()
  const router = useRouter()
  const [timeWindow, setTimeWindow] = useState("7d")
  const [agentType, setAgentType] = useState("all")
  const [mcpChannel, setMcpChannel] = useState("all")
  const [showRawLogs, setShowRawLogs] = useState(false)

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <Coins className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
              <p className="text-gray-500 mb-4">Connect your wallet to view token usage and analytics.</p>
              <Button onClick={() => router.push("/")} className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Token Usage</h1>
        <p className="text-gray-500">
          Track how $SYN tokens are consumed across your agents, memory storage, and MCP coordination.
        </p>
      </div>

      {/* Usage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total $SYN Used</p>
                <h3 className="text-2xl font-bold">427.25</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Coins className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Avg. Cost Per Agent (30d)</p>
                <h3 className="text-2xl font-bold">13.2 $SYN</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Top Consuming Agent</p>
                <h3 className="text-2xl font-bold">Governance Sentinel</h3>
                <p className="text-sm text-gray-500">182.3 $SYN</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
          <Select value={timeWindow} onValueChange={setTimeWindow}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
          <Select value={agentType} onValueChange={setAgentType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sentinel">Sentinel</SelectItem>
              <SelectItem value="analyzer">Analyzer</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="guard">Guard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MCP Channel</label>
          <Select value={mcpChannel} onValueChange={setMcpChannel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="secure">Secure Channel</SelectItem>
              <SelectItem value="high">High Bandwidth</SelectItem>
              <SelectItem value="low">Low Latency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto self-end">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Consumption Chart */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Token Consumption</h3>
            <Tabs defaultValue="line" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "$SYN", angle: -90, position: "insideLeft" }} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="memory" name="Memory Writes" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="mcp" name="MCP Messages" stroke="#82ca9d" />
                <Line type="monotone" dataKey="compute" name="Compute Cycles" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Agent Usage Breakdown */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Agent Usage Breakdown</h3>
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Token usage by agent. Click on column headers to sort.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="ml-2">
                <SortDesc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Agent Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total $SYN Used</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last 7d</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {agentsData.map((agent) => (
                  <tr key={agent.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{agent.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{agent.type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agent.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : agent.status === "Idle"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{agent.totalUsed} $SYN</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{agent.last7d} $SYN</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{agent.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Raw Logs */}
      <Collapsible open={showRawLogs} onOpenChange={setShowRawLogs} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Raw Logs
            <span className={`transform transition-transform ${showRawLogs ? "rotate-180" : ""}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                {rawLogs.map((log, index) => (
                  <div key={index} className="mb-2">
                    <span className="text-gray-500">{log.timestamp}</span>
                    <span
                      className={`ml-2 ${
                        log.message.includes("[MCP]")
                          ? "text-cyan-600"
                          : log.message.includes("[COMPUTE]")
                            ? "text-purple-600"
                            : "text-blue-600"
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default TokenUsagePage
