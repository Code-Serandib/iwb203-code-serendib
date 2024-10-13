"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar as CalendarIcon, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [meetingsByMonth, setMeetingsByMonth] = useState([]);
  const [totalStakeholders, setTotalStakeholders] = useState(0);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const profileUpdated = localStorage.getItem("profileUpdated");
  const googleAccessToken = localStorage.getItem("googleAccessToken");

  useEffect(() => {
    async function fetchData() {
      try {
        const [meetingsRes, stakeholdersRes, totalMeetingsRes] = await Promise.all([
          axios.get('http://localhost:9091/api/meetingCountByMonth'),
          axios.get('http://localhost:9091/api/totalStakeholdersCount'),
          axios.get('http://localhost:9091/api/totalMeetingsCount')
        ]);

        setMeetingsByMonth(meetingsRes.data);
        setTotalStakeholders(stakeholdersRes.data);
        setTotalMeetings(totalMeetingsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  
  useEffect(() => { 
    // const profileUpdated = localStorage.getItem("profileUpdated");
    if (googleAccessToken) {
      const res = getUserFromAccessToken(googleAccessToken);
    }
  }, [router]);

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }
  
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
            <div className="text-2xl font-bold">{totalStakeholders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings Held</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meetings per Month</CardTitle>
            <CardDescription>Number of meetings held each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={meetingsByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}