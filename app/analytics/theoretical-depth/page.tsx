"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BarChart2, GitBranch, Handshake} from 'lucide-react'
import Layout from '@/components/layout/Layout'

export default function AnalysisTool() {
  const [activeTab, setActiveTab] = useState('influence')
  // Influence Index state
  const [influenceValues, setInfluenceValues] = useState({ power: 0, legitimacy: 0, urgency: 0 })
  const [stakeholderType, setStakeholderType] = useState("")
  const [influenceResult, setInfluenceResult] = useState(null)

  // Nash Equilibrium state
  const [players, setPlayers] = useState([])
  const [optionCounts, setOptionCounts] = useState([])
  const [options, setOptions] = useState([])
  const [payoffs, setPayoffs] = useState([])
  const [nashResult, setNashResult] = useState(null)

  // Social Exchange state
  const [benefit, setBenefit] = useState(0)
  const [cost, setCost] = useState(0)
  const [relationshipValue, setRelationshipValue] = useState(null)

  const handleInfluenceSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setInfluenceResult((influenceValues.power + influenceValues.legitimacy + influenceValues.urgency) / 3)
    }, 1000)
  }

  const handleNashSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setNashResult("Nash Equilibrium Matrix Result")
    }, 1000)
  }

  const handleSocialExchangeSubmit = (e) => {
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
                  <Slider
                    id="power"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[influenceValues.power]}
                    onValueChange={(value) => setInfluenceValues({ ...influenceValues, power: value[0] })}
                    className="[&_[role=slider]]:bg-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legitimacy">Legitimacy (0-10)</Label>
                  <Slider
                    id="legitimacy"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[influenceValues.legitimacy]}
                    onValueChange={(value) => setInfluenceValues({ ...influenceValues, legitimacy: value[0] })}
                    className="[&_[role=slider]]:bg-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency (0-10)</Label>
                  <Slider
                    id="urgency"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[influenceValues.urgency]}
                    onValueChange={(value) => setInfluenceValues({ ...influenceValues, urgency: value[0] })}
                    className="[&_[role=slider]]:bg-black"
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
              {nashResult && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                  <h3 className="text-lg font-semibold text-black mb-2">Nash Equilibrium Result:</h3>
                  <pre className="bg-white p-4 rounded border border-gray-300">{nashResult}</pre>
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
                    step="0.01"
                    value={benefit}
                    onChange={(e) => setBenefit(parseFloat(e.target.value))}
                    className="border-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                    className="border-black"
                  />
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Relationship Value</Button>
              </form>
              {relationshipValue !== null && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                  <p className="text-lg font-semibold text-black">Relationship Value: {relationshipValue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {relationshipValue > 0 ? 'Positive relationship' : relationshipValue < 0 ? 'Negative relationship' : 'Neutral relationship'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </Layout>
  )
}