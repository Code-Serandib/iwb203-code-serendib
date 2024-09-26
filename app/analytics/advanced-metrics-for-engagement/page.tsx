'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart2, LineChart, PieChart } from 'lucide-react'
import Layout from '@/components/layout/Layout'

export default function AdvancedMetricsPage() {
    const [activeTab, setActiveTab] = useState('eps')
    const [eps, setEPS] = useState<number | null>(null)
    const [bscScores, setBSCScores] = useState<{ [key: string]: number } | null>(null)
    const [tes, setTES] = useState<number | null>(null)

    const calculateEPS = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const influence = parseFloat(formData.get('influence') as string)
        const interest = parseFloat(formData.get('interest') as string)
        const impact = parseFloat(formData.get('impact') as string)
        const score = (influence * 0.4) + (interest * 0.3) + (impact * 0.3)
        setEPS(score)
    }

    const calculateBSC = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const financial = parseFloat(formData.get('financial') as string)
        const customer = parseFloat(formData.get('customer') as string)
        const internal = parseFloat(formData.get('internal') as string)
        const learning = parseFloat(formData.get('learning') as string)
        setBSCScores({ financial, customer, internal, learning })
    }

    const calculateTES = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const frequency = parseFloat(formData.get('frequency') as string)
        const quality = parseFloat(formData.get('quality') as string)
        const duration = parseFloat(formData.get('duration') as string)
        const score = (frequency * 0.3) + (quality * 0.4) + (duration * 0.3)
        setTES(score)
    }

    return (
        <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-black">Advanced Engagement Metrics</CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Analyze and quantify stakeholder engagement with advanced metrics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="eps" className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <BarChart2 className="w-4 h-4 mr-2" />
                                <span className="hidden md:inline">EPS Equation</span>
                            </TabsTrigger>
                            <TabsTrigger value="bsc" className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <PieChart className="w-4 h-4 mr-2" />
                                <span className="hidden md:inline">BSC Metrics</span>
                            </TabsTrigger>
                            <TabsTrigger value="tes" className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <LineChart className="w-4 h-4 mr-2" />
                                <span className="hidden md:inline">TES Calculation</span>  
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="eps">
                            <form onSubmit={calculateEPS} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="influence">Influence (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="influence"
                                        name="influence"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interest">Interest (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="interest"
                                        name="interest"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="impact">Impact (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="impact"
                                        name="impact"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate EPS</Button>
                            </form>
                            {eps !== null && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                                    <p className="text-lg font-semibold text-black">Engagement Priority Score (EPS): {eps.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {eps < 3 ? 'Low Priority' : eps < 7 ? 'Medium Priority' : 'High Priority'}
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="bsc">
                            <form onSubmit={calculateBSC} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="financial">Financial Perspective (0-100)</Label>
                                    <Input type="number" id="financial" name="financial" min={0} max={100} required className="border-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer">Customer Perspective (0-100)</Label>
                                    <Input type="number" id="customer" name="customer" min={0} max={100} required className="border-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="internal">Internal Process Perspective (0-100)</Label>
                                    <Input type="number" id="internal" name="internal" min={0} max={100} required className="border-black" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="learning">Learning & Growth Perspective (0-100)</Label>
                                    <Input type="number" id="learning" name="learning" min={0} max={100} required className="border-black" />
                                </div>
                                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate BSC Scores</Button>
                            </form>
                            {bscScores && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                                    <p className="text-lg font-semibold text-black mb-2">Balanced Scorecard Metrics</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Perspective</TableHead>
                                                <TableHead>Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(bscScores).map(([key, value]) => (
                                                <TableRow key={key}>
                                                    <TableCell className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                                                    <TableCell>{value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="tes">
                            <form onSubmit={calculateTES} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="frequency">Engagement Frequency (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="frequency"
                                        name="frequency"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quality">Engagement Quality (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="quality"
                                        name="quality"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Engagement Duration (0-10)</Label>
                                    <Input
                                        type="number"
                                        id="duration"
                                        name="duration"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        defaultValue={5}
                                        required
                                        className="border-black"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate TES</Button>
                            </form>
                            {tes !== null && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                                    <p className="text-lg font-semibold text-black">Total Engagement Score (TES): {tes.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {tes < 3 ? 'Low Engagement' : tes < 7 ? 'Moderate Engagement' : 'High Engagement'}
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