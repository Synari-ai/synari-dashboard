"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronRight, LinkIcon, Search, Code, Activity, Shield, Moon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "../providers/wallet-provider"
import { Sidebar } from "../components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WalletConnect } from "../components/wallet-connect"
import { DarkModeCreateAgent } from "../components/dark-mode-create-agent"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  type: z.enum(["autonomous-trader", "observational-sentinel", "reasoning-analyst", "policy-enforcer", "custom"]),
  mode: z.enum(["trading", "observing", "analyzing"]),
  traits: z.array(z.string()).optional(),
})

// Agent traits options
const traitOptions = [
  {
    id: "reactive",
    label: "Reactive",
    description: "Responds quickly to environmental changes",
  },
  {
    id: "exploratory",
    label: "Exploratory",
    description: "Seeks new information and opportunities",
  },
  {
    id: "deterministic",
    label: "Deterministic",
    description: "Produces consistent outputs for the same inputs",
  },
  {
    id: "self-modifying",
    label: "Self-Modifying",
    description: "Can update its own behavior patterns",
  },
  {
    id: "cooperative",
    label: "Cooperative",
    description: "Works well with other agents",
  },
]

export default function CreateAgentPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected } = useWallet()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      prompt: "",
      type: "autonomous-trader",
      mode: "trading",
      traits: [],
    },
  })

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Prevent scroll jump when selecting agent type
  const handleAgentTypeClick = useCallback(
    (e: React.MouseEvent, value: string) => {
      e.preventDefault()
      form.setValue("type", value as any)
    },
    [form],
  )

  // Prevent scroll jump when selecting operation mode
  const handleModeClick = useCallback(
    (e: React.MouseEvent, value: string) => {
      e.preventDefault()
      form.setValue("mode", value as any)
    },
    [form],
  )

  // If dark mode is enabled, render the dark mode version
  if (isDarkMode) {
    return <DarkModeCreateAgent onToggleTheme={toggleTheme} />
  }

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Form Submitted",
      description: "Moving to next step...",
    })
    nextStep()
  }

  // Handle step navigation
  const nextStep = () => {
    if (step === 1) {
      form.trigger(["name", "description", "prompt", "type", "mode"]).then((isValid) => {
        if (isValid) setStep(2)
      })
    }
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
              <CardDescription>Please connect your wallet to create an agent.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto" style={{ scrollBehavior: "smooth" }}>
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/")}>
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mt-4">Create New Agent</h1>
            <p className="text-gray-500 mt-2">Configure and deploy a new AI agent to your network</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div className="h-1 w-12 bg-gray-200">
                <div className={`h-full bg-black ${step >= 2 ? "w-full" : "w-0"}`}></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <div className="h-1 w-12 bg-gray-200">
                <div className={`h-full bg-black ${step >= 3 ? "w-full" : "w-0"}`}></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                3
              </div>
            </div>
            <div className="text-sm font-medium">Step {step} of 3</div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <>
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Basic Information</CardTitle>
                      <CardDescription>Provide basic details about your agent</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., YIELD BOT" {...field} />
                            </FormControl>
                            <FormDescription>This is the display name for your agent.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agent Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe what your agent does..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Agent Prompt */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Agent Prompt</CardTitle>
                      <CardDescription>Define the behavior of your agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initial Behavior Prompt</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your agent's initial goals, behavior logic, or environment rules using natural language. This prompt will be used to seed its intent model."
                                className="min-h-[150px] font-mono text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Agent Type */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Agent Type</CardTitle>
                      <CardDescription>
                        Select the foundational behavior pattern for your agent. All types can be extended via prompt
                        and config.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div
                                  onClick={(e) => handleAgentTypeClick(e, "autonomous-trader")}
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "autonomous-trader" ? "border-black" : "border-muted"} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3">
                                    <LinkIcon className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold">Autonomous Trader</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Executes actions based on encoded strategies and environmental triggers. Ideal for
                                    agents that trade, rebalance, or initiate smart contract calls.
                                  </div>
                                  <input
                                    type="radio"
                                    name="type"
                                    value="autonomous-trader"
                                    checked={field.value === "autonomous-trader"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleAgentTypeClick(e, "observational-sentinel")}
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "observational-sentinel" ? "border-black" : "border-muted"} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3">
                                    <Search className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold">Observational Sentinel</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Monitors contracts, APIs, or data feeds to detect anomalies and trigger alerts. Best
                                    for on-chain watchers or off-chain monitoring bots.
                                  </div>
                                  <input
                                    type="radio"
                                    name="type"
                                    value="observational-sentinel"
                                    checked={field.value === "observational-sentinel"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleAgentTypeClick(e, "reasoning-analyst")}
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "reasoning-analyst" ? "border-black" : "border-muted"} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3">
                                    <Activity className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold">Reasoning Analyst</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Analyzes inputs, forecasts outcomes, and provides structured responses using LLM
                                    reasoning. Useful for research, governance, or inference agents.
                                  </div>
                                  <input
                                    type="radio"
                                    name="type"
                                    value="reasoning-analyst"
                                    checked={field.value === "reasoning-analyst"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleAgentTypeClick(e, "policy-enforcer")}
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "policy-enforcer" ? "border-black" : "border-muted"} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3">
                                    <Shield className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold">Policy Enforcer</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Validates other agents' actions and enforces protocol rules. Can approve, reject, or
                                    trigger counter-actions based on defined behavior logic.
                                  </div>
                                  <input
                                    type="radio"
                                    name="type"
                                    value="policy-enforcer"
                                    checked={field.value === "policy-enforcer"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleAgentTypeClick(e, "custom")}
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "custom" ? "border-black" : "border-muted"} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-3">
                                    <Code className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold">Custom Agent</div>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Fully user-defined. Build your own logic using prompts, configs, and modular
                                    behavior traits. Maximum flexibility for developers.
                                  </div>
                                  <input
                                    type="radio"
                                    name="type"
                                    value="custom"
                                    checked={field.value === "custom"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Operation Mode */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Operation Mode</CardTitle>
                      <CardDescription>Select how your agent will operate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="mode"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <div className="flex flex-wrap gap-4">
                                <div
                                  onClick={(e) => handleModeClick(e, "trading")}
                                  className={`px-4 py-2 rounded-full border-2 ${
                                    field.value === "trading"
                                      ? "bg-black text-white border-black"
                                      : "border-muted hover:bg-gray-100"
                                  } cursor-pointer transition-colors`}
                                >
                                  Trading
                                  <input
                                    type="radio"
                                    name="mode"
                                    value="trading"
                                    checked={field.value === "trading"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleModeClick(e, "observing")}
                                  className={`px-4 py-2 rounded-full border-2 ${
                                    field.value === "observing"
                                      ? "bg-black text-white border-black"
                                      : "border-muted hover:bg-gray-100"
                                  } cursor-pointer transition-colors`}
                                >
                                  Observing
                                  <input
                                    type="radio"
                                    name="mode"
                                    value="observing"
                                    checked={field.value === "observing"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>

                                <div
                                  onClick={(e) => handleModeClick(e, "analyzing")}
                                  className={`px-4 py-2 rounded-full border-2 ${
                                    field.value === "analyzing"
                                      ? "bg-black text-white border-black"
                                      : "border-muted hover:bg-gray-100"
                                  } cursor-pointer transition-colors`}
                                >
                                  Analyzing
                                  <input
                                    type="radio"
                                    name="mode"
                                    value="analyzing"
                                    checked={field.value === "analyzing"}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* MCP Channel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">MCP Channel</CardTitle>
                      <CardDescription>Select how your agent coordinates with other agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="default">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select default coordination channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="secure">Secure Channel</SelectItem>
                          <SelectItem value="high-bandwidth">High Bandwidth</SelectItem>
                          <SelectItem value="low-latency">Low Latency</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">
                        This defines how the agent syncs behavior and memory via MCP.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Agent Traits */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Agent Traits</CardTitle>
                      <CardDescription>Select traits that define your agent's behavior</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="traits"
                        render={() => (
                          <FormItem>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {traitOptions.map((trait) => (
                                <FormField
                                  key={trait.id}
                                  control={form.control}
                                  name="traits"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={trait.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(trait.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...(field.value || []), trait.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== trait.id) || [],
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel className="font-medium">{trait.label}</FormLabel>
                                          <FormDescription className="text-xs">{trait.description}</FormDescription>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Deployment Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Deployment Details</CardTitle>
                      <CardDescription>Preview of deployment configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chain Target</span>
                          <span className="font-medium">EVM-compatible (default)</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Estimated Cost</span>
                          <Badge variant="outline" className="font-mono text-base px-3 py-1">
                            12.4 $SYN
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" className="w-full md:w-auto">
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
