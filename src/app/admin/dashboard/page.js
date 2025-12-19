'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon,
  PaintBrushIcon,
  PhotoIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

import AddPaintingForm from '@/components/AddPaintingForm';
import ManagePaintingsPage from '../paintings/PaintingsList';
import OrdersPageContent from './orders/OrdersList';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-amber-100 shadow-sm">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <PaintBrushIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Artist Studio</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">Artist Account</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('add')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'add' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
              >
                <PaintBrushIcon className="h-5 w-5" />
                <span>Add New Artwork</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
              >
                <PhotoIcon className="h-5 w-5" />
                <span>Manage Artworks</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Customer Orders</span>
              </button>

              <a
                href="/"
                target="_blank"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 transition-colors"
              >
                <HomeIcon className="h-5 w-5" />
                <span>View Website</span>
              </a>
            </nav>

            {/* Sign Out Button */}
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content  */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Artist!</h1>
            <p className="text-gray-600">Manage your artworks and orders here.</p>
          </div>

          {/* Content Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-sm p-6">
            {/* Tab Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'add' && 'Add New Artwork'}
                {activeTab === 'manage' && 'Manage Artworks'}
                {activeTab === 'orders' && 'Customer Orders'}
              </h2>
              <p className="text-gray-600 mt-2">
                {activeTab === 'add' && 'Add a new painting to your collection'}
                {activeTab === 'manage' && 'Edit, delete, or mark artworks as sold'}
                {activeTab === 'orders' && 'View and manage customer orders'}
              </p>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'add' ? (
                <AddPaintingForm />
              ) : activeTab === 'manage' ? (
                <ManagePaintingsPage />
              ) : activeTab === 'orders' ? (
                <OrdersPageContent />
              ) : null}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/"
              target="_blank"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">View Live Site</h3>
                  <p className="text-amber-100 text-sm mt-1">See how customers view your gallery</p>
                </div>
                <HomeIcon className="h-8 w-8" />
              </div>
            </a>

            <button
              onClick={() => setActiveTab('add')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Add New Art</h3>
                  <p className="text-green-100 text-sm mt-1">Upload your latest creation</p>
                </div>
                <PaintBrushIcon className="h-8 w-8" />
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}