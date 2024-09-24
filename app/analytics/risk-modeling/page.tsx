'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, BarChart2, Calculator, TrendingDown } from 'lucide-react'
import Layout from '@/components/layout/Layout'

export default function RiskModelingPage() {
    const [activeTab, setActiveTab] = useState('risk-score')
    const [riskScore, setRiskScore] = useState<number | null>(null)
    const [projectRisk, setProjectRisk] = useState<string | null>(null)
    const [engagementAlert, setEngagementAlert] = useState<boolean | null>(null)

    const calculateRiskScore = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const impact = parseFloat(formData.get('impact') as string)
        const probability = parseFloat(formData.get('probability') as string)
        const score = impact * probability
        setRiskScore(score)
    }

    const calculateProjectRisk = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const complexity = parseInt(formData.get('complexity') as string)
        const stakeholders = parseInt(formData.get('stakeholders') as string)
        const timeline = parseInt(formData.get('timeline') as string)
        const score = complexity + stakeholders + timeline
        let risk = 'Low'
        if (score > 20) risk = 'High'
        else if (score > 10) risk = 'Medium'
        setProjectRisk(risk)
    }

    const calculateEngagementDrop = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const currentEngagement = parseFloat(formData.get('currentEngagement') as string)
        const previousEngagement = parseFloat(formData.get('previousEngagement') as string)
        const dropPercentage = ((previousEngagement - currentEngagement) / previousEngagement) * 100
        setEngagementAlert(dropPercentage > 20)
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center text-black">Risk Modeling Calculator</CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Analyze and quantify risks in your stakeholder management projects
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger
                                    value="risk-score"
                                    className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                                >
                                    <Calculator className="w-4 h-4 mr-2" />
                                    <span className="hidden md:inline">Risk Score</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="project-risk"
                                    className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                                >
                                    <BarChart2 className="w-4 h-4 mr-2" />
                                    <span className="hidden md:inline">Project Risk</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="engagement-drop"
                                    className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white"
                                >
                                    <TrendingDown className="w-4 h-4 mr-2" />
                                    <span className="hidden md:inline">Engagement Drop</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="risk-score">
                                <form onSubmit={calculateRiskScore} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="impact">Impact (1-10)</Label>
                                        <Slider
                                            id="impact"
                                            name="impact"
                                            min={1}
                                            max={10}
                                            step={0.1}
                                            defaultValue={[5]}
                                            className="[&_[role=slider]]:bg-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="probability">Probability (0-1)</Label>
                                        <Slider
                                            id="probability"
                                            name="probability"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            defaultValue={[0.5]}
                                            className="[&_[role=slider]]:bg-black"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Risk Score</Button>
                                </form>
                                {riskScore !== null && (
                                    <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                                        <p className="text-lg font-semibold text-black">Risk Score: {riskScore.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {riskScore < 3 ? 'Low Risk' : riskScore < 7 ? 'Medium Risk' : 'High Risk'}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="project-risk">
                                <form onSubmit={calculateProjectRisk} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="complexity">Project Complexity (1-10)</Label>
                                        <Input type="number" id="complexity" name="complexity" min={1} max={10} required className="border-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stakeholders">Number of Stakeholders</Label>
                                        <Input type="number" id="stakeholders" name="stakeholders" min={1} required className="border-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timeline">Project Timeline (months)</Label>
                                        <Input type="number" id="timeline" name="timeline" min={1} required className="border-black" />
                                    </div>
                                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Assess Project Risk</Button>
                                </form>
                                {projectRisk && (
                                    <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                                        <p className="text-lg font-semibold text-black">Project Risk: {projectRisk}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {projectRisk === 'Low' ? 'Standard monitoring required' :
                                                projectRisk === 'Medium' ? 'Increased vigilance recommended' :
                                                    'Immediate risk mitigation strategies needed'}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="engagement-drop">
                                <form onSubmit={calculateEngagementDrop} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentEngagement">Current Engagement Rate (%)</Label>
                                        <Input type="number" id="currentEngagement" name="currentEngagement" min={0} max={100} required className="border-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="previousEngagement">Previous Engagement Rate (%)</Label>
                                        <Input type="number" id="previousEngagement" name="previousEngagement" min={0} max={100} required className="border-black" />
                                    </div>
                                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Check Engagement Drop</Button>
                                </form>
                                {engagementAlert !== null && (
                                    <div className={`mt-6 p-4 rounded-lg border ${engagementAlert ? 'bg-gray-200 border-black' : 'bg-gray-100 border-gray-300'}`}>
                                        <div className="flex items-center">
                                            <AlertCircle className={`w-6 h-6 mr-2 ${engagementAlert ? 'text-black' : 'text-gray-600'}`} />
                                            <p className={`text-lg font-semibold ${engagementAlert ? 'text-black' : 'text-gray-800'}`}>
                                                {engagementAlert ? 'Engagement Drop Alert!' : 'Engagement Stable'}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {engagementAlert ? 'Consider strategies to re-engage stakeholders.' : 'Keep up the good work!'}
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
