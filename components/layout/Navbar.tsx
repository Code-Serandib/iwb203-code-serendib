"use client"
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        {/* Menu for Mobile */}
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 pr-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/600x400"
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>John Doe</span>
          <ChevronDown size={16} />
        </Button>
      </div>
    </header>
  );
}
