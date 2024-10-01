"use client"

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BarChart2, TrendingDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import RiskScoreForm from './RiskScoreForm';
import ProjectRiskForm from './ProjectRiskForm';
import EngagementDropForm from './EngagementDropFrom';

export default function RiskModelingPage() {
    const [activeTab, setActiveTab] = useState('risk-score');

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
                <div className="w-full mx-auto">
                    <h1 className="text-3xl font-bold text-center text-black">Risk Modeling Calculator</h1>
                    <p className="text-center text-gray-600">
                        Analyze and quantify risks in your stakeholder management projects
                    </p>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="risk-score"
                                         className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <Calculator className="w-4 h-4 mr-2"/>
                                <span className="hidden md:inline">Risk Score</span>
                            </TabsTrigger>
                            <TabsTrigger value="project-risk"
                                         className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <BarChart2 className="w-4 h-4 mr-2"/>
                                <span className="hidden md:inline">Project Risk</span>
                            </TabsTrigger>
                            <TabsTrigger value="engagement-drop"
                                         className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                <TrendingDown className="w-4 h-4 mr-2"/>
                                <span className="hidden md:inline">Engagement Drop</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="risk-score">
                            <RiskScoreForm />
                        </TabsContent>
                        <TabsContent value="project-risk">
                            <ProjectRiskForm />
                        </TabsContent>
                        <TabsContent value="engagement-drop">
                            <EngagementDropForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
