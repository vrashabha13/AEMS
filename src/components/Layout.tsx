import React from "react";
import { BookOpen, Home, Settings, Users, PlusSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  userRole: "student" | "faculty" | null;
}

const Layout = ({ children, userRole }: LayoutProps) => {
  const location = useLocation();

  const getFacultyNavigation = () => [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Assignments", href: "/assignments", icon: BookOpen },
    { name: "Students", href: "/students", icon: Users },
    { name: "Create Quiz", href: "/create-quiz", icon: PlusSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const getStudentNavigation = () => [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const navigation =
    userRole === "faculty" ? getFacultyNavigation() : getStudentNavigation();

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <div className="flex h-screen bg-[#EBEBEB]">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-[#C0C0C0]">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="sidebar-header">
                  <img
                    src="/src/utils/aemslogolight.png"
                    alt="AEMS"
                    className="sidebar-logo w-20 h-20"
                  />
                </div>
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={
                          location.pathname === item.href
                            ? "bg-[#FF6700] text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            : "text-[#3A6EA5] hover:bg-[#EBEBEB] group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                        }
                      >
                        <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
