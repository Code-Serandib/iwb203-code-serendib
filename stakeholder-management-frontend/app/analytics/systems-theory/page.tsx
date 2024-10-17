"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart2, GitBranch, Zap, Plus, Minus } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import axios from 'axios';


export default function StakeholderAnalytics() {
  const [activeTab, setActiveTab] = useState('sim')
  const [stakeholders, setStakeholders] = useState([
    { name: "Stakeholder A", connectionStrength: 0.0, influence: 0.0 },
    { name: "Stakeholder B", connectionStrength: 0.0, influence: 0.0 },
    { name: "Stakeholder C", connectionStrength: 0.0, influence: 0.0 }
  ])
  const [deltaBehavior, setDeltaBehavior] = useState([0.0, 0.0, 0.0])
  const [simResult, setSimResult] = useState("")
  const [dsiResult, setDsiResult] = useState("")
  const [sisResult, setSisResult] = useState("")
  const [snsResult, setSnsResult] = useState("")

  const handleStakeholderChange = (index: number, field: string, value: string) => {
    const updatedStakeholders = [...stakeholders]
    updatedStakeholders[index][field] = field === 'name' ? value : parseFloat(value)
    setStakeholders(updatedStakeholders)
  }

  const handleDeltaBehaviorChange = (index: number, value: string) => {
    const updatedDeltaBehavior = [...deltaBehavior]
    updatedDeltaBehavior[index] = parseFloat(value)
    setDeltaBehavior(updatedDeltaBehavior)
  }

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { name: `Stakeholder ${stakeholders.length + 1}`, connectionStrength: 0, influence: 0 }])
    setDeltaBehavior([...deltaBehavior, 0])
  }

  const removeStakeholder = (index: number) => {
    if (stakeholders.length > 1) {
      const updatedStakeholders = stakeholders.filter((_, i) => i !== index)
      const updatedDeltaBehavior = deltaBehavior.filter((_, i) => i !== index)
      setStakeholders(updatedStakeholders)
      setDeltaBehavior(updatedDeltaBehavior)
    }
  }

  const formatResult = (result: { [s: string]: unknown } | ArrayLike<unknown>) => {
    return (
      <div>
        {Object.entries(result).map(([key, value], idx) => (
          <div key={idx} className="mb-4">
            <h4 className="font-bold">{key}:</h4>
            {Array.isArray(value)
              ? value.map((subItem, subIdx) => (
                <div key={subIdx} className="ml-4">
                  {Object.entries(subItem).map(([subKey, subValue]) => (
                    <p key={subKey} className="ml-4">
                      {subKey}: {typeof subValue === "object" ? subValue.description : subValue}
                    </p>
                  ))}
                </div>
              ))
              : typeof value === "object"
                ? Object.entries(value).map(([subKey, subValue]) => (
                  <p key={subKey} className="ml-4">
                    {subKey}: {subValue}
                  </p>
                ))
                : <p className="ml-4">{value}</p>}
          </div>
        ))}
      </div>
    );
  };


  const calculateSIM = async () => {
    try {
      const response = await axios.post('http://localhost:9091/api/calculate_sim', {
        stakeholders
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setSimResult(response.data["Stakeholder Influence Matrix (SIM)"]);
    } catch (error) {
      console.error("Error calculating SIM:", error);
      setSimResult("Error calculating SIM. Please try again.");
    }
  }


  const calculateDSI = async () => {
    try {
      const response = await axios.post('http://localhost:9091/api/calculate_dsi', {
        stakeholders,
        deltaBehavior
      });
      setDsiResult(response.data["Dynamic Stakeholder Impact (DSI)"]);
    } catch (error) {
      console.error("Error calculating DSI:", error);
      setDsiResult("Error calculating DSI. Please try again.");
    }
  };


  const calculateSIS = async () => {
    try {
      const response = await axios.post('http://localhost:9091/api/calculate_sis', {
        stakeholders
      });
      setSisResult(response.data["Systemic Influence Score (SIS)"]);
    } catch (error) {
      console.error("Error calculating SIS:", error);
      setSisResult("Error calculating SIS. Please try again.");
    }
  };

  const calculateSNS = async () => {
    try {
      const response = await axios.post('http://localhost:9091/api/calculate_sns', {
        stakeholders,
        deltaBehavior
      });
      setSnsResult(response.data["Stakeholder Network Stability (SNS)"]);
    } catch (error) {
      console.error("Error calculating SNS:", error);
      setSnsResult("Error calculating SNS. Please try again.");
    }
  };


  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
        <Card className="w-full mx-auto">
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
                    <div key={index} className="grid grid-cols-4 gap-4 items-center">
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
                      <Button onClick={() => removeStakeholder(index)} variant="outline" className="border-black">
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addStakeholder} variant="outline" className="w-full border-black">
                    <Plus className="w-4 h-4 mr-2" /> Add Stakeholder
                  </Button>
                  <Button onClick={calculateSIM} className="w-full bg-black text-white hover:bg-gray-800">Calculate SIM</Button>
                </div>
                {/* {simResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Stakeholder Influence Matrix (SIM):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(simResult, null, 2)}
                    </pre>
                  </div>
                )} */}
                {simResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg">SIM Results:</h4>
                    {formatResult(simResult)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dsi">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center">
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
                      <Button onClick={() => removeStakeholder(index)} variant="outline" className="border-black">
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addStakeholder} variant="outline" className="w-full border-black">
                    <Plus className="w-4 h-4 mr-2" /> Add Stakeholder
                  </Button>
                  <Button onClick={calculateDSI} className="w-full bg-black text-white hover:bg-gray-800">Calculate DSI</Button>
                </div>
                {/* {dsiResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Dynamic Stakeholder Impact (DSI):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(dsiResult, null, 2)}
                    </pre>
                  </div>
                )} */}

                {dsiResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg">DSI Results:</h4>
                    {formatResult(dsiResult)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sis">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center">
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
                      <Button onClick={() => removeStakeholder(index)} variant="outline" className="border-black">
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addStakeholder} variant="outline" className="w-full border-black">
                    <Plus className="w-4 h-4 mr-2" /> Add Stakeholder
                  </Button>
                  <Button onClick={calculateSIS} className="w-full bg-black text-white hover:bg-gray-800">Calculate SIS</Button>
                </div>
                {/* {sisResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Systemic Influence Score (SIS):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(sisResult, null, 2)}
                    </pre>
                  </div>
                )} */}

                {sisResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg">SIS Results:</h4>
                    {formatResult(sisResult)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sns">
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center">
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
                      <Button onClick={() => removeStakeholder(index)} variant="outline" className="border-black">
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addStakeholder} variant="outline" className="w-full border-black">
                    <Plus className="w-4 h-4 mr-2" /> Add Stakeholder
                  </Button>
                  <Button onClick={calculateSNS} className="w-full bg-black text-white hover:bg-gray-800">Calculate SNS</Button>
                </div>
                {/* {snsResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold text-black mb-2">Stakeholder Network Stability (SNS):</h3>
                    <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                      {JSON.stringify(snsResult, null, 2)}
                    </pre>
                  </div>
                )} */}

                {snsResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h4 className="font-bold text-lg">SNS Results:</h4>
                    {formatResult(snsResult)}
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