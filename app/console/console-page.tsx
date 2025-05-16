"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/app/components/sidebar"
import { WalletConnect } from "@/app/components/wallet-connect"
import { Pause, Play, Trash2, Download, Clock, TerminalIcon, X, Filter, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useWallet } from "@/app/providers/wallet-provider"

// Mock data for console logs
const initialLogs = [
  {
    id: 1,
    type: "info",
    timestamp: "2023-06-15 09:32:14",
    message: "[MCP] System initialized. Protocol version 2.4.1",
  },
  { id: 2, type: "info", timestamp: "2023-06-15 09:32:15", message: "[MCP] Agent-7 connected to coordination layer" },
  {
    id: 3,
    type: "mcp",
    timestamp: "2023-06-15 09:32:18",
    message: "[MCP] Agent-7 subscribed to Sentinel-3 (channel: governance-stream)",
  },
  { id: 4, type: "info", timestamp: "2023-06-15 09:33:01", message: "[MCP] Agent-12 connected to coordination layer" },
  {
    id: 5,
    type: "warning",
    timestamp: "2023-06-15 09:33:05",
    message: "[MCP] Warning: Agent-12 memory sync delayed (latency: 230ms)",
  },
  {
    id: 6,
    type: "mcp",
    timestamp: "2023-06-15 09:33:12",
    message: "[MCP] Memory diff detected: Agent-7 updated knowledge graph",
  },
  {
    id: 7,
    type: "error",
    timestamp: "2023-06-15 09:33:30",
    message: "[MCP] Error: Agent-3 failed to validate policy constraints",
  },
  { id: 8, type: "info", timestamp: "2023-06-15 09:34:02", message: "[MCP] Agent-3 reconnected to coordination layer" },
  {
    id: 9,
    type: "mcp",
    timestamp: "2023-06-15 09:34:15",
    message: "[MCP] Policy update propagated to all connected agents",
  },
  {
    id: 10,
    type: "info",
    timestamp: "2023-06-15 09:35:00",
    message: "[MCP] Agent-5 initiated task execution (task_id: 28f3a9)",
  },
  {
    id: 11,
    type: "mcp",
    timestamp: "2023-06-15 09:35:22",
    message: "[MCP] Cross-agent memory synchronization complete",
  },
  {
    id: 12,
    type: "warning",
    timestamp: "2023-06-15 09:36:05",
    message: "[MCP] Warning: Resource contention detected in shared memory pool",
  },
  { id: 13, type: "info", timestamp: "2023-06-15 09:36:30", message: "[MCP] Agent-9 connected to coordination layer" },
  {
    id: 14,
    type: "mcp",
    timestamp: "2023-06-15 09:36:45",
    message: "[MCP] Agent-9 subscribed to Analytics-Stream (channel: metrics)",
  },
  {
    id: 15,
    type: "error",
    timestamp: "2023-06-15 09:37:10",
    message: "[MCP] Error: Failed to allocate memory for Agent-12 expansion request",
  },
]

// Mock data for agents
const agents = [
  { id: 3, name: "Agent-3", type: "Policy", status: "Error" },
  { id: 5, name: "Agent-5", type: "Task", status: "Active" },
  { id: 7, name: "Agent-7", type: "Sentinel", status: "Active" },
  { id: 9, name: "Agent-9", type: "Analytics", status: "Active" },
  { id: 12, name: "Agent-12", type: "Governance", status: "Idle" },
]

function ConsolePage() {
  const { isConnected } = useWallet()
  const router = useRouter()
  const [logs, setLogs] = useState(initialLogs)
  const [command, setCommand] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [selectedAgents, setSelectedAgents] = useState<number[]>([])
  const consoleEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of console
  useEffect(() => {
    if (!isPaused && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, isPaused])

  // Add new log periodically (simulating real-time logs)
  useEffect(() => {
    if (isPaused) return

    const types = ["info", "warning", "error", "mcp"]
    const messages = [
      "[MCP] Memory synchronization in progress...",
      "[MCP] Agent-7 updated shared knowledge base",
      "[MCP] New policy constraint added to governance layer",
      "[MCP] Agent-12 requested access to restricted memory segment",
      "[MCP] Cross-agent communication established on secure channel",
    ]

    const interval = setInterval(() => {
      const type = types[Math.floor(Math.random() * types.length)]
      const message = messages[Math.floor(Math.random() * messages.length)]
      const now = new Date()
      const timestamp = now.toISOString().replace("T", " ").substring(0, 19)

      setLogs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type,
          timestamp,
          message,
        },
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const now = new Date()
    const timestamp = now.toISOString().replace("T", " ").substring(0, 19)

    setLogs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "command",
        timestamp,
        message: `> ${command}`,
      },
    ])

    // Simulate response
    setTimeout(() => {
      const responseNow = new Date()
      const responseTimestamp = responseNow.toISOString().replace("T", " ").substring(0, 19)

      const responseType = "info"
      let responseMessage = "[MCP] Command processed successfully"

      if (command.includes("run simulation")) {
        responseMessage = `[MCP] Initiated simulation for Agent-${command.split(" ")[1]}`
      } else if (command.includes("monitor")) {
        responseMessage = `[MCP] Now monitoring ${command.split(" ")[1]} memory changes`
      } else if (command.includes("trace")) {
        responseMessage = `[MCP] Trace enabled for ${command.split(" ")[1]} for the next 15 minutes`
      }

      setLogs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: responseType,
          timestamp: responseTimestamp,
          message: responseMessage,
        },
      ])
    }, 500)

    setCommand("")
  }

  const clearLogs = () => {
    setLogs([])
  }

  const downloadLogs = () => {
    const logText = logs.map((log) => `${log.timestamp} [${log.type.toUpperCase()}] ${log.message}`).join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "synari-mcp-logs.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleAgentFilter = (agentId: number) => {
    setSelectedAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-white"
      case "warning":
        return "text-orange-400"
      case "error":
        return "text-red-400"
      case "mcp":
        return "text-cyan-400"
      case "command":
        return "text-green-400"
      default:
        return "text-white"
    }
  }

  const filteredLogs =
    selectedAgents.length > 0
      ? logs.filter((log) => selectedAgents.some((id) => log.message.includes(`Agent-${id}`)))
      : logs

  if (!isConnected) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="flex justify-end mb-6">
            <WalletConnect />
          </div>
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
              <TerminalIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to access the Console and interact with your agents via MCP.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Console</h1>
              <p className="text-gray-600">
                Monitor and interact with agents directly via the MCP layer. Ideal for advanced inspection, debugging,
                or live coordination.
              </p>
            </div>
            <WalletConnect />
          </div>

          <div className="flex gap-4 h-[calc(100vh-180px)]">
            {/* Main Console Area */}
            <div className="flex-1 flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              {/* Console Controls */}
              <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-green-400 font-mono text-sm mr-2">●</span>
                  <span className="text-white font-mono text-sm">MCP Terminal</span>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => setIsPaused(!isPaused)} className="p-1 rounded hover:bg-gray-700">
                          {isPaused ? (
                            <Play size={16} className="text-white" />
                          ) : (
                            <Pause size={16} className="text-white" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isPaused ? "Resume" : "Pause"} stream</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={clearLogs} className="p-1 rounded hover:bg-gray-700">
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear logs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={downloadLogs} className="p-1 rounded hover:bg-gray-700">
                          <Download size={16} className="text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export logs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setShowTimestamps(!showTimestamps)}
                          className={`p-1 rounded hover:bg-gray-700 ${showTimestamps ? "text-cyan-400" : "text-white"}`}
                        >
                          <Clock size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showTimestamps ? "Hide" : "Show"} timestamps</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Separator orientation="vertical" className="h-4 bg-gray-700" />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setShowSidePanel(!showSidePanel)}
                          className="p-1 rounded hover:bg-gray-700"
                        >
                          <Filter size={16} className="text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showSidePanel ? "Hide" : "Show"} agent filter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Console Log Area */}
              <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="mb-1">
                    {showTimestamps && <span className="text-gray-500 mr-2">[{log.timestamp}]</span>}
                    <span className={getLogColor(log.type)}>{log.message}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>

              {/* Command Input */}
              <form onSubmit={handleCommandSubmit} className="bg-gray-800 p-2 flex gap-2">
                <span className="text-green-400 font-mono self-center">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type command... (e.g. /agent 7 run simulation)"
                  className="flex-1 bg-gray-700 text-white font-mono p-2 rounded border border-gray-600 focus:outline-none focus:border-cyan-500"
                />
                <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">
                  Send
                </button>
              </form>
            </div>

            {/* Side Panel */}
            {showSidePanel && (
              <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="bg-gray-100 px-4 py-3 font-medium flex justify-between items-center">
                  <span>Active Agents</span>
                  <button onClick={() => setShowSidePanel(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="px-4 py-3 border-b border-gray-100 flex items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleAgentFilter(agent.id)}
                    >
                      <Checkbox
                        id={`agent-${agent.id}`}
                        checked={selectedAgents.includes(agent.id)}
                        onCheckedChange={() => toggleAgentFilter(agent.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${
                              agent.status === "Active"
                                ? "bg-green-500"
                                : agent.status === "Idle"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span>{agent.type}</span>
                          <span className="mx-1">•</span>
                          <span>{agent.status}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500">
                  {selectedAgents.length > 0
                    ? `Filtering ${selectedAgents.length} agent${selectedAgents.length > 1 ? "s" : ""}`
                    : "Showing all MCP events"}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ConsolePage
