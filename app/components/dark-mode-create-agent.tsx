"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronRight, LinkIcon, Search, Code, Activity, Shield, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "../providers/wallet-provider"
import { DarkModeSidebar } from "./dark-mode-sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DarkModeWalletConnect } from "./dark-mode-wallet-connect"
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

export function DarkModeCreateAgent({ onToggleTheme }) {
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
      <div className="flex h-screen bg-[#0B0E11] text-[#A3A3A3]">
        <DarkModeSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md bg-[#141517] border-[#2A2D32] text-white">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription className="text-[#A3A3A3]">
                Please connect your wallet to create an agent.
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

  return (
    <div className="flex h-screen bg-[#0B0E11] text-[#A3A3A3]">
      <DarkModeSidebar />
      <div className="flex-1 p-8 overflow-auto" style={{ scrollBehavior: "smooth" }}>
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="gap-2 text-[#A3A3A3] hover:text-white hover:bg-[#2A2D32]"
              onClick={() => router.push("/")}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mt-4 text-white">Create New Agent</h1>
            <p className="text-[#A3A3A3] mt-2">Configure and deploy a new AI agent to your network</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-white text-[#141517]" : "bg-[#2A2D32] text-[#A3A3A3]"
                }`}
              >
                1
              </div>
              <div className="h-1 w-12 bg-[#2A2D32]">
                <div className={`h-full bg-white ${step >= 2 ? "w-full" : "w-0"}`}></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-white text-[#141517]" : "bg-[#2A2D32] text-[#A3A3A3]"
                }`}
              >
                2
              </div>
              <div className="h-1 w-12 bg-[#2A2D32]">
                <div className={`h-full bg-white ${step >= 3 ? "w-full" : "w-0"}`}></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-white text-[#141517]" : "bg-[#2A2D32] text-[#A3A3A3]"
                }`}
              >
                3
              </div>
            </div>
            <div className="text-sm font-medium text-white">Step {step} of 3</div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <>
                  {/* Basic Information */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Basic Information</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">
                        Provide basic details about your agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Agent Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., YIELD BOT"
                                {...field}
                                className="bg-[#0B0E11] border-[#2A2D32] text-white focus-visible:ring-white"
                              />
                            </FormControl>
                            <FormDescription className="text-[#A3A3A3]">
                              This is the display name for your agent.
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Agent Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what your agent does..."
                                {...field}
                                className="bg-[#0B0E11] border-[#2A2D32] text-white focus-visible:ring-white"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Agent Prompt */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Agent Prompt</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">Define the behavior of your agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Initial Behavior Prompt</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your agent's initial goals, behavior logic, or environment rules using natural language. This prompt will be used to seed its intent model."
                                className="min-h-[150px] font-mono text-sm bg-[#0B0E11] border-[#2A2D32] text-white focus-visible:ring-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Agent Type */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Agent Type</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">
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
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "autonomous-trader" ? "border-white" : "border-[#2A2D32]"} bg-[#0B0E11] p-4 hover:bg-[#2A2D32] hover:text-white cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-white text-[#141517] flex items-center justify-center mb-3">
                                    <LinkIcon className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold text-white">Autonomous Trader</div>
                                  <div className="text-sm text-[#A3A3A3] mt-2">
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
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "observational-sentinel" ? "border-white" : "border-[#2A2D32]"} bg-[#0B0E11] p-4 hover:bg-[#2A2D32] hover:text-white cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-white text-[#141517] flex items-center justify-center mb-3">
                                    <Search className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold text-white">Observational Sentinel</div>
                                  <div className="text-sm text-[#A3A3A3] mt-2">
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
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "reasoning-analyst" ? "border-white" : "border-[#2A2D32]"} bg-[#0B0E11] p-4 hover:bg-[#2A2D32] hover:text-white cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-white text-[#141517] flex items-center justify-center mb-3">
                                    <Activity className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold text-white">Reasoning Analyst</div>
                                  <div className="text-sm text-[#A3A3A3] mt-2">
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
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "policy-enforcer" ? "border-white" : "border-[#2A2D32]"} bg-[#0B0E11] p-4 hover:bg-[#2A2D32] hover:text-white cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-white text-[#141517] flex items-center justify-center mb-3">
                                    <Shield className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold text-white">Policy Enforcer</div>
                                  <div className="text-sm text-[#A3A3A3] mt-2">
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
                                  className={`flex flex-col h-full rounded-md border-2 ${field.value === "custom" ? "border-white" : "border-[#2A2D32]"} bg-[#0B0E11] p-4 hover:bg-[#2A2D32] hover:text-white cursor-pointer`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-white text-[#141517] flex items-center justify-center mb-3">
                                    <Code className="h-6 w-6" />
                                  </div>
                                  <div className="font-semibold text-white">Custom Agent</div>
                                  <div className="text-sm text-[#A3A3A3] mt-2">
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
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Operation Mode */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Operation Mode</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">Select how your agent will operate</CardDescription>
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
                                      ? "bg-white text-[#141517] border-white"
                                      : "border-[#2A2D32] text-[#A3A3A3] hover:bg-[#2A2D32] hover:text-white"
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
                                      ? "bg-white text-[#141517] border-white"
                                      : "border-[#2A2D32] text-[#A3A3A3] hover:bg-[#2A2D32] hover:text-white"
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
                                      ? "bg-white text-[#141517] border-white"
                                      : "border-[#2A2D32] text-[#A3A3A3] hover:bg-[#2A2D32] hover:text-white"
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
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* MCP Channel */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">MCP Channel</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">
                        Select how your agent coordinates with other agents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="default">
                        <SelectTrigger className="bg-[#0B0E11] border-[#2A2D32] text-white focus-visible:ring-white">
                          <SelectValue placeholder="Select default coordination channel" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#141517] border-[#2A2D32] text-white">
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="secure">Secure Channel</SelectItem>
                          <SelectItem value="high-bandwidth">High Bandwidth</SelectItem>
                          <SelectItem value="low-latency">Low Latency</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#A3A3A3] mt-2">
                        This defines how the agent syncs behavior and memory via MCP.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Agent Traits */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Agent Traits</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">
                        Select traits that define your agent's behavior
                      </CardDescription>
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
                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#2A2D32] p-4 bg-[#0B0E11]"
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
                                            className="border-[#2A2D32] data-[state=checked]:bg-white data-[state=checked]:text-[#141517]"
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel className="font-medium text-white">{trait.label}</FormLabel>
                                          <FormDescription className="text-xs text-[#A3A3A3]">
                                            {trait.description}
                                          </FormDescription>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Deployment Details */}
                  <Card className="bg-[#141517] border-[#2A2D32]">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Deployment Details</CardTitle>
                      <CardDescription className="text-[#A3A3A3]">Preview of deployment configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[#0B0E11] p-4 rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[#A3A3A3]">Chain Target</span>
                          <span className="font-medium text-white">EVM-compatible (default)</span>
                        </div>
                        <Separator className="bg-[#2A2D32]" />
                        <div className="flex justify-between items-center">
                          <span className="text-[#A3A3A3]">Estimated Cost</span>
                          <Badge
                            variant="outline"
                            className="font-mono text-base px-3 py-1 border-[#2A2D32] text-white"
                          >
                            12.4 $SYN
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" className="w-full md:w-auto bg-white text-[#141517] hover:bg-white/90">
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
