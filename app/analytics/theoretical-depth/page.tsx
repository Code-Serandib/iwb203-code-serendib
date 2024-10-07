"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, GitBranch, Handshake } from 'lucide-react'
import Layout from '@/components/layout/Layout';
import InfluenceForm from './InfluenceForm'
import NashForm from './NashForm'
import SocialForm from './SocialForm'

export default function AnalysisTool() {
  const [activeTab, setActiveTab] = useState<string>('influence')

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
      <Card className="w-full mx-auto">
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
              <InfluenceForm />
            </TabsContent>

            <TabsContent value="nash">
              <NashForm />
            </TabsContent>

            <TabsContent value="social">
              <SocialForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
    </Layout>
  )
}