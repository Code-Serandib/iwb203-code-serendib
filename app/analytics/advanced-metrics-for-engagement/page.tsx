"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/layout/Layout';
import EPSForm from './EPSComponent';
import BSCForm from './BSCComponent';
import TESForm from './TESComponent';
import {BarChart2, Calculator, TrendingDown} from "lucide-react";

export default function AdvancedMetricsPage() {
    const [activeTab, setActiveTab] = useState('eps');
    const [eps, setEPS] = useState<number | null>(null);
    const [bscScores, setBSCScores] = useState<{ [key: string]: number } | null>(null);
    const [tes, setTES] = useState<number | null>(null);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4">
                <Card className="w-full mx-auto">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center text-black">Advanced Metrics</CardTitle>
                        <CardDescription className="text-gray-600 text-center">Analyze your performance with detailed metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="eps"
                                             className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                    <Calculator className="w-4 h-4 mr-2"/>
                                    <span className="hidden md:inline">EPS</span>
                                </TabsTrigger>
                                <TabsTrigger value="bsc"
                                             className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                    <BarChart2 className="w-4 h-4 mr-2"/>
                                    <span className="hidden md:inline">BSC</span>
                                </TabsTrigger>
                                <TabsTrigger value="tes"
                                             className="flex items-center justify-center data-[state=active]:bg-black data-[state=active]:text-white">
                                    <TrendingDown className="w-4 h-4 mr-2"/>
                                    <span className="hidden md:inline">TES</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="eps">
                                <EPSForm/>
                            </TabsContent>
                            <TabsContent value="bsc">
                                <BSCForm/>
                            </TabsContent>
                            <TabsContent value="tes">
                                <TESForm/>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
