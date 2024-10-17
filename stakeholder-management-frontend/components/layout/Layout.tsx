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
      const googleAccessToken = localStorage.getItem("googleAccessToken");
      const googleRefreshToken = localStorage.getItem("googleRefreshToken");
    
      // Run both checks in parallel
      const validations = [];
      
      if (!token) {
        if (googleAccessToken) {
          validations.push(validateGoogleToken(googleAccessToken, googleRefreshToken));
        } else {
          router.push("/sign-in");
        }
      } else {
        validations.push(validateBackendToken(token));
      }
    
      Promise.all(validations)
        .then(results => {
          const [googleValid, backendValid] = results;
          console.log("results ::",results);
          console.log("googleValid ::",googleValid);
          console.log("backendValid ::",backendValid);
          
          if (!googleValid && !backendValid) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("googleAccessToken");
            localStorage.removeItem("googleRefreshToken");
            router.push("/sign-in");
          }
        })
        .catch(error => {
          console.error("Error in validation:", error);
          router.push("/sign-in");
        });
    }, [router]);
    
    const validateGoogleToken = async (accessToken: string, googleRefreshToken: string | null) => {
      try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
        if (response.ok) {
          const data = await response.json();
          const currentTime = Math.floor(Date.now() / 1000);
          
          // Check if the token is expired
          if (data.exp < currentTime) {
            console.log("Access token expired. Refreshing...");
            const newAccessToken = await refreshAccessToken(googleRefreshToken);
            
            if (newAccessToken) {
              localStorage.setItem("googleAccessToken", newAccessToken);
              return true;
            } else {
              return false;
            }
          } else {
            console.log("Access token is valid.");
            return true;
          }
        } else {
          console.error("Invalid Google access token.");
          return false;
        }
      } catch (error) {
        console.error("Google token validation failed:", error);
        return false;
      }
    };
    
    const validateBackendToken = async (token: string) => {
      try {
        const response = await axios.get("http://localhost:9091/api/validateToken", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status === 200) {
          console.log("Backend token is valid.");
          return true;
        } else {
          console.error("Backend token is invalid.");
          return false;
        }
      } catch (error) {
        console.error("Backend token validation failed:", error);
        return false;
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
            return result.access_token;
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

