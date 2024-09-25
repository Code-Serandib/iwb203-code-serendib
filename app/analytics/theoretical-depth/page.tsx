"use client"

import { useState, FormEvent } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, GitBranch, Handshake } from 'lucide-react'
import Layout from '@/components/layout/Layout'

type InfluenceValues = {
  power: number;
  legitimacy: number;
  urgency: number;
};

export default function AnalysisTool() {
  const [activeTab, setActiveTab] = useState<string>('influence')
  
  // Influence Index state
  const [influenceValues, setInfluenceValues] = useState<InfluenceValues>({ power: 0, legitimacy: 0, urgency: 0 })
  const [stakeholderType, setStakeholderType] = useState<string>("")
  const [influenceResult, setInfluenceResult] = useState<number | null>(null)

  // Nash Equilibrium state
  const [players, setPlayers] = useState<string[]>([])
  const [optionCounts, setOptionCounts] = useState<number[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [payoffs, setPayoffs] = useState<number[]>([])
  const [nashResult, setNashResult] = useState<string | null>(null)

  // Social Exchange state
  const [benefit, setBenefit] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [relationshipValue, setRelationshipValue] = useState<number | null>(null)

  const handleInfluenceSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setInfluenceResult((influenceValues.power + influenceValues.legitimacy + influenceValues.urgency) / 3)
    }, 1000)
  }

  const handleNashSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setNashResult("Nash Equilibrium Matrix Result")
    }, 1000)
  }

  const handleSocialExchangeSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setRelationshipValue(benefit - cost)
    }, 1000)
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-black">Analysis Tool</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Analyze stakeholder influence, game theory equilibrium, and social exchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="influence"
                className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Influence Index</span>
              </TabsTrigger>
              <TabsTrigger
                value="nash"
                className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Nash Equilibrium</span>
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
              >
                <Handshake className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Social Exchange</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="influence">
              <form onSubmit={handleInfluenceSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="power">Power (0-10)</Label>
                  <Input
                    id="power"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={influenceValues.power}
                    onChange={(e) => setInfluenceValues({ ...influenceValues, power: Number(e.target.value) })}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legitimacy">Legitimacy (0-10)</Label>
                  <Input
                    id="legitimacy"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={influenceValues.legitimacy}
                    onChange={(e) => setInfluenceValues({ ...influenceValues, legitimacy: Number(e.target.value) })}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency (0-10)</Label>
                  <Input
                    id="urgency"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={influenceValues.urgency}
                    onChange={(e) => setInfluenceValues({ ...influenceValues, urgency: Number(e.target.value) })}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stakeholder-type">Stakeholder Type</Label>
                  <Select onValueChange={setStakeholderType}>
                    <SelectTrigger id="stakeholder-type" className="border-black">
                      <SelectValue placeholder="Select stakeholder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Influence Index</Button>
              </form>
              <div className="mt-4">
                <Input type="file" accept=".csv,.xlsx" />
                <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
              </div>
              {influenceResult !== null && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                  <p className="text-lg font-semibold text-black">Influence Index: {influenceResult.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {influenceResult < 3 ? 'Low Influence' : influenceResult < 7 ? 'Medium Influence' : 'High Influence'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nash">
              <form onSubmit={handleNashSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="players">Players (comma-separated)</Label>
                  <Input
                    id="players"
                    value={players.join(",")}
                    onChange={(e) => setPlayers(e.target.value.split(","))}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option-counts">Option Counts (comma-separated)</Label>
                  <Input
                    id="option-counts"
                    value={optionCounts.join(",")}
                    onChange={(e) => setOptionCounts(e.target.value.split(",").map(Number))}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="options">Options (comma-separated)</Label>
                  <Input
                    id="options"
                    value={options.join(",")}
                    onChange={(e) => setOptions(e.target.value.split(","))}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoffs">Payoffs (comma-separated)</Label>
                  <Input
                    id="payoffs"
                    value={payoffs.join(",")}
                    onChange={(e) => setPayoffs(e.target.value.split(",").map(Number))}
                    className="border-black"
                  />
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Nash Equilibrium</Button>
              </form>
              <div className="mt-4">
                <Input type="file" accept=".csv,.xlsx" />
                <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
              </div>
              {nashResult && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                  <h3 className="text-lg font-semibold text-black mb-2">Nash Equilibrium Result</h3>
                  <p>{nashResult}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="social">
              <form onSubmit={handleSocialExchangeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="benefit">Benefit</Label>
                  <Input
                    id="benefit"
                    type="number"
                    value={benefit}
                    onChange={(e) => setBenefit(Number(e.target.value))}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="border-black"
                  />
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Social Exchange</Button>
              </form>
              <div className="mt-4">
                <Input type="file" accept=".csv,.xlsx" />
                <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
              </div>
              {relationshipValue !== null && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                  <h3 className="text-lg font-semibold text-black mb-2">Relationship Value</h3>
                  <p>{relationshipValue}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
    </Layout>
  )
}