"use client"
import React, { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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
