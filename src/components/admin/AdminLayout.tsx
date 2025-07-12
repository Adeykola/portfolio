import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  Target, 
  Settings, 
  LogOut,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Skills', href: '/admin/skills', icon: Target },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { signOut, user } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and actions */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-white">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Home className="mr-3 h-4 w-4" />
                View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};