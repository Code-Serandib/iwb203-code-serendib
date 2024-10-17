"use client"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Users, Network } from 'lucide-react'
import Layout from '@/components/layout/Layout'

const analyticsPages = [
  {
    title: "Theoretical Depth",
    description: "Dive into the academic foundations of stakeholder theory",
    icon: <BookOpen className="w-12 h-12 mb-4" />,
    link: "analytics/theoretical-depth",
    color: "from-gray-600 to-gray-800"
  },
  {
    title: "Dynamic Risk Modeling",
    description: "Simulate and analyze stakeholder risks in real-time",
    icon: <TrendingUp className="w-12 h-12 mb-4" />,
    link: "analytics/risk-modeling",
    color: "from-gray-500 to-gray-700"
  },
  {
    title: "Advanced Metrics for Engagement",
    description: "Measure and optimize stakeholder engagement with precision",
    icon: <Users className="w-12 h-12 mb-4" />,
    link: "analytics/advanced-metrics-for-engagement",
    color: "from-gray-400 to-gray-600"
  },
  {
    title: "Systems Theory",
    description: "Understand stakeholders within complex organizational ecosystems",
    icon: <Network className="w-12 h-12 mb-4" />,
    link: "analytics/systems-theory",
    color: "from-gray-300 to-gray-500"
  }
]

export default function StakeholderAnalyticsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* API Key Notification Section */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-yellow-800">API Key Required</h2>
                <p className="text-yellow-700">
                  To use the Stakeholder Analytics Hub, you need to generate an API key. This key will provide you access to all the available analytics tools.
                </p>
              </div>
              <Link href="/api-manage" passHref>
                <Button className="bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-300">
                  Generate API Key
                </Button>
              </Link>
            </div>
          </div>

          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Stakeholder Analytics Hub</h1>
            <p className="text-xl text-gray-600">Unlock the power of data-driven stakeholder management</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyticsPages.map((page, index) => (
              <Card key={index} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className={`bg-gradient-to-br ${page.color} p-6 flex flex-col items-center text-white transition-all duration-300 group-hover:scale-105`}>
                  {page.icon}
                  <CardTitle className="text-2xl font-bold text-center mb-2">{page.title}</CardTitle>
                </div>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-600 text-center">{page.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                  <Link href={page.link} passHref>
                    <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white transition-colors duration-300">
                      Explore
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <footer className="mt-16 text-center">
            <p className="text-gray-600">Empowering decision-makers with cutting-edge stakeholder insights</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button variant="ghost" className="text-black hover:text-gray-600 transition-colors duration-300">About Us</Button>
              <Button variant="ghost" className="text-black hover:text-gray-600 transition-colors duration-300">Contact</Button>
              <Button variant="ghost" className="text-black hover:text-gray-600 transition-colors duration-300">FAQ</Button>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  )
}
