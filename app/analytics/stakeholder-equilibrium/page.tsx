"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart2, GitBranch, Network, Zap } from 'lucide-react'
import Layout from '@/components/layout/Layout'

export default function StakeholderAnalytics() {
  const [activeTab, setActiveTab] = useState('sim')
  const [stakeholders, setStakeholders] = useState([
    { name: "Stakeholder A", connectionStrength: 0.8, influence: 0.6 },
    { name: "Stakeholder B", connectionStrength: 0.7, influence: 0.5 },
    { name: "Stakeholder C", connectionStrength: 0.6, influence: 0.4 }
  ])
  const [deltaBehavior, setDeltaBehavior] = useState([0.2, -0.1, 0.3])
  const [simResult, setSimResult] = useState(null)
  const [dsiResult, setDsiResult] = useState(null)
  const [sisResult, setSisResult] = useState(null)
  const [snsResult, setSnsResult] = useState(null)

  const handleStakeholderChange = (index, field, value) => {
    const updatedStakeholders = [...stakeholders]
    updatedStakeholders[index][field] = parseFloat(value)
    setStakeholders(updatedStakeholders)
  }

  const handleDeltaBehaviorChange = (index, value) => {
    const updatedDeltaBehavior = [...deltaBehavior]
    updatedDeltaBehavior[index] = parseFloat(value)
    setDeltaBehavior(updatedDeltaBehavior)
  }

  const calculateSIM = async () => {
    try {
      const response = await fetch('http://localhost:9090/stakeholder-analytics/calculate_sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stakeholders })
      })
      const data = await response.json()
      setSimResult(data["Stakeholder Influence Matrix (SIM)"])
    } catch (error) {
      console.error("Error calculating SIM:", error)
      setSimResult("Error calculating SIM. Please try again.")
    }
  }

  const calculateDSI = async () => {
    try {
      const response = await fetch('http://localhost:9090/stakeholder-analytics/calculate_dsi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stakeholders, deltaBehavior })
      })
      const data = await response.json()
      setDsiResult(data["Dynamic Stakeholder Impact (DSI)"])
    } catch (error) {
      console.error("Error calculating DSI:", error)
      setDsiResult("Error calculating DSI. Please try again.")
    }
  }

  const calculateSIS = async () => {
    try {
      const response = await fetch('http://localhost:9090/stakeholder-analytics/calculate_sis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stakeholders })
      })
      const data = await response.json()
      setSisResult(data["Systemic Influence Score (SIS)"])
    } catch (error) {
      console.error("Error calculating SIS:", error)
      setSisResult("Error calculating SIS. Please try again.")
    }
  }

  const calculateSNS = async () => {
    try {
      const response = await fetch('http://localhost:9090/stakeholder-analytics/calculate_sns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stakeholders, deltaBehavior })
      })
      const data = await response.json()
      setSnsResult(data["Stakeholder Network Stability (SNS)"])
    } catch (error) {
      console.error("Error calculating SNS:", error)
      setSnsResult("Error calculating SNS. Please try again.")
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-black">Stakeholder Analytics</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Analyze stakeholder influence, impact, and network stability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="sim"
                  className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Stakeholder Influence Matrix</span>
                  <span className="md:hidden">SIM</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dsi"
                  className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Dynamic Stakeholder Impact</span>
                  <span className="md:hidden">DSI</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sis"
                  className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  {/* <Network className="w-4 h-4 mr-2" /> */}
                  <span className="hidden md:inline">Systemic Influence Score</span>
                  <span className="md:hidden">SIS</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sns"
                  className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Stakeholder Network Stability</span>
                  <span className="md:hidden">SNS</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sim">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <Input
                        value={stakeholder.name}
                        onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.connectionStrength}
                        onChange={(e) => handleStakeholderChange(index, 'connectionStrength', e.target.value)}
                        placeholder="Connection Strength"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.influence}
                        onChange={(e) => handleStakeholderChange(index, 'influence', e.target.value)}
                        placeholder="Influence"
                        className="border-black"
                      />
                    </div>
                  ))}
                  <Button onClick={calculateSIM} className="w-full bg-black text-white hover:bg-gray-800">Calculate SIM</Button>
                </div>
                {simResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Stakeholder Influence Matrix:</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(simResult, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dsi">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <Input
                        value={stakeholder.name}
                        onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.connectionStrength}
                        onChange={(e) => handleStakeholderChange(index, 'connectionStrength', e.target.value)}
                        placeholder="Connection Strength"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.influence}
                        onChange={(e) => handleStakeholderChange(index, 'influence', e.target.value)}
                        placeholder="Influence"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={deltaBehavior[index]}
                        onChange={(e) => handleDeltaBehaviorChange(index, e.target.value)}
                        placeholder="Delta Behavior"
                        className="border-black"
                      />
                    </div>
                  ))}
                  <Button onClick={calculateDSI} className="w-full bg-black text-white hover:bg-gray-800">Calculate DSI</Button>
                </div>
                {dsiResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Dynamic Stakeholder Impact (DSI):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(dsiResult, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sis">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <Input
                        value={stakeholder.name}
                        onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.connectionStrength}
                        onChange={(e) => handleStakeholderChange(index, 'connectionStrength', e.target.value)}
                        placeholder="Connection Strength"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.influence}
                        onChange={(e) => handleStakeholderChange(index, 'influence', e.target.value)}
                        placeholder="Influence"
                        className="border-black"
                      />
                    </div>
                  ))}
                  <Button onClick={calculateSIS} className="w-full bg-black text-white hover:bg-gray-800">Calculate SIS</Button>
                </div>
                {sisResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Systemic Influence Score (SIS):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(sisResult, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sns">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <Input
                        value={stakeholder.name}
                        onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.connectionStrength}
                        onChange={(e) => handleStakeholderChange(index, 'connectionStrength', e.target.value)}
                        placeholder="Connection Strength"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={stakeholder.influence}
                        onChange={(e) => handleStakeholderChange(index, 'influence', e.target.value)}
                        placeholder="Influence"
                        className="border-black"
                      />
                      <Input
                        type="number"
                        value={deltaBehavior[index]}
                        onChange={(e) => handleDeltaBehaviorChange(index, e.target.value)}
                        placeholder="Delta Behavior"
                        className="border-black"
                      />
                    </div>
                  ))}
                  <Button onClick={calculateSNS} className="w-full bg-black text-white hover:bg-gray-800">Calculate SNS</Button>
                </div>
                {snsResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Stakeholder Network Stability (SNS):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(snsResult, null, 2)}
                    </pre>
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