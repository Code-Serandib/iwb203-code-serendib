"use client";
import { useState } from 'react';
import { Home, Users, PieChart, ChevronLeft, ChevronRight, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isMobileMenuOpen, toggleSidebar }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/home', label: 'Dashboard', icon: Home },
    { href: '/stakeholders', label: 'Stakeholders', icon: Users },
    { href: '/analytics', label: 'Analytics', icon: PieChart },
    { href: '/survey/manage', label: 'Surveys', icon: NotebookPen },
  ];

  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r transition-all duration-300 fixed md:relative z-50 h-full`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {!isCollapsed && <span className="text-2xl font-semibold">StakeManage</span>}
        <button onClick={toggleSidebarCollapse} className="p-2">
          {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="px-2 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center px-2 py-2 rounded-lg transition-colors duration-200 
                    ${isActive ? 'bg-gray-200 text-black font-semibold' : 'hover:bg-gray-100'}`}
                >
                  <Icon className="w-6 h-6" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
