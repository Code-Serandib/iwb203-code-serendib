"use client"
import React, { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      router.push("/sign-in");
    } else {
      // Validate the token with the backend API
      axios.get("http://localhost:9091/api/validateToken", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("Autho :", token);
        console.log(response.data); // Handle valid token response
      })
      .catch(error => {
        console.error("Token validation failed:", error);
        router.push("/sign-in"); // Redirect if the token is invalid
      });
    }
  }, [router]);


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
            )}
        </div>
    )
}

export default Layout
