"use client"; 

import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PieChart } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
  const router = useRouter();
  const profileUpdated = localStorage.getItem("profileUpdated");
  const googleAccessToken = localStorage.getItem("googleAccessToken");
  useEffect(() => {
    
    // const profileUpdated = localStorage.getItem("profileUpdated");
    if (googleAccessToken) {
      const res = getUserFromAccessToken(googleAccessToken);
    }

  }, [router]);

  const getUserFromAccessToken = async (accessToken: string | null) => {
    try {
        const response = await fetch("http://localhost:9091/api/getUserDataFromAccessToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accessToken: accessToken })
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Result user: ",result);
            if(result.user.address=="" && result.user.contactNumber=="" && result.user.organizationName==""
               && result.user.organizationType=="" && result.user.industry==""){
                if(!profileUpdated){
                   localStorage.setItem("profileUpdated", "updated");
                   router.push("/profile");
                }

            }
              
            return result;
        } else {
            console.error("Failed to retrieve user data:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error during request:", error);
        return null;
    }
};

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stakeholders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
