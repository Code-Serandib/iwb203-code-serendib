"use client"
import React, { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; 

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
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    const googleRefreshToken = localStorage.getItem("googleRefreshToken");
    const email = localStorage.getItem("email");

    console.log("Google Access Token:", googleAccessToken);
    console.log("Google Refresh Token:", googleRefreshToken);

    if (!token) {
      if (googleAccessToken) {
        validateGoogleToken(googleAccessToken, googleRefreshToken);
      } else {
        router.push("/sign-in");
      }

    } else {
      axios.get("http://localhost:9091/api/validateToken", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log("Autho :", token);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Token validation failed:", error);
        router.push("/sign-in");
      });
    }
  }, [router]);

  const validateGoogleToken = async (accessToken: string, googleRefreshToken: any) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      if (response.ok) {
        const data = await response.json();
        const currentTime = Math.floor(Date.now() / 1000);
  
        // Check if token is expired
        if (data.exp < currentTime) {
          console.log("Access token is expired");

          refreshAccessToken(googleRefreshToken).then(newAccessToken => {
              if (newAccessToken) {
                  // Store the new access token
                  localStorage.setItem("googleAccessToken", newAccessToken);
                  console.log("New access token received and stored.");
              } else {
                  // If refreshing the token fails, redirect to sign-in
                  router.push("/sign-in");
              }
          }).catch(error => {
              console.error("Error refreshing access token:", error);
              router.push("/sign-in");
          });
          
        } else {
          console.log("Access token is valid");
        }
      } else {
        console.error("Invalid access token");
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Error validating Google access token:", error);
      router.push("/sign-in");
    }
  };

  const refreshAccessToken = async (refreshToken: string | null) => {
    try {
        const response = await fetch("http://localhost:9091/api/refreshToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (response.ok) {
            const result = await response.json();
            return result.access_token; // Return new access token
        } else {
            console.error("Failed to refresh access token:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error during token refresh request:", error);
        return null;
    }
};


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
function jwt_decode(googleAccessToken: string) {
  throw new Error('Function not implemented.');
}

