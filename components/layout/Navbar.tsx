"use client";
import { Bell, ChevronDown, Menu, Search, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Function to return the page name based on the current route
  const getPageTitle = () => {
    switch (pathname) {
      case '/home':
        return 'Dashboard';
      case '/stakeholders':
        return 'Stakeholders';
      case '/analytics':
        return 'Analytics';
      default:
        return ''; // Fallback for unknown paths
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        {/* Menu for Mobile */}
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        {/* Display dynamic page title */}
        <h1 className="hidden md:block text-2xl font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={toggleProfileDropdown}
          >
            <img
              src="https://placehold.co/600x400"
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>John Doe</span>
            <ChevronDown size={16} />
          </Button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-20">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("email");
                  localStorage.removeItem("googleAccessToken");
                  localStorage.removeItem("googleRefreshToken");
                  router.push("/sign-in");
                }}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
