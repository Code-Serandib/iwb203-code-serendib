"use client"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NotebookPenIcon } from 'lucide-react'
import Layout from '@/components/layout/Layout'

const surveyPages = [
  {
    title: "Enhanced Survey Management",
    description: "Add and Manage Stakeholder's Survey",
    icon: <NotebookPenIcon className="w-12 h-12 mb-4" />,
    link: "survey/manage",
    color: "from-gray-600 to-gray-800"
  }
]

export default function StakeholderSurveyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-8">
        <div className="max-w-6xl mx-auto">

          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Stakeholder Suvery Management</h1>
            <p className="text-xl text-gray-600">Reach To The Stakeholder</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {surveyPages.map((page, index) => (
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
