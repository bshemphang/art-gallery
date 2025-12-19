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
  ShoppingBagIcon,
  Bars3Icon, 
  XMarkIcon  
} from '@heroicons/react/24/outline';

import AddPaintingForm from '@/components/AddPaintingForm';
import ManagePaintingsPage from '../paintings/PaintingsList';
import OrdersPageContent from './orders/OrdersList';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ADD for mobile
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
      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-amber-100 p-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <PaintBrushIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Artist Studio</span>
          </div>
          
          <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-6">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <PaintBrushIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Artist Studio</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>

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

              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('add'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'add' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
                >
                  <PaintBrushIcon className="h-5 w-5" />
                  <span>Add New Artwork</span>
                </button>

                <button
                  onClick={() => { setActiveTab('manage'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
                >
                  <PhotoIcon className="h-5 w-5" />
                  <span>Manage Artworks</span>
                </button>

                <button
                  onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-amber-50'}`}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>Customer Orders</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>View Website</span>
                </a>
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-amber-100 shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <PaintBrushIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Artist Studio</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

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

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="lg:hidden mb-4">
            <div className="flex overflow-x-auto gap-2 pb-2">
              <button
                onClick={() => setActiveTab('add')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg ${activeTab === 'add' ? 'bg-amber-500 text-white' : 'bg-white border border-amber-200'}`}
              >
                Add Art
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg ${activeTab === 'manage' ? 'bg-amber-500 text-white' : 'bg-white border border-amber-200'}`}
              >
                Manage
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-amber-500 text-white' : 'bg-white border border-amber-200'}`}
              >
                Orders
              </button>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-4 lg:mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Welcome back, Artist!</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage your artworks and orders here.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-amber-100 shadow-sm p-4 lg:p-6">
            <div className="mb-4 lg:mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {activeTab === 'add' && 'Add New Artwork'}
                {activeTab === 'manage' && 'Manage Artworks'}
                {activeTab === 'orders' && 'Customer Orders'}
              </h2>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                {activeTab === 'add' && 'Add a new painting to your collection'}
                {activeTab === 'manage' && 'Edit, delete, or mark artworks as sold'}
                {activeTab === 'orders' && 'View and manage customer orders'}
              </p>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] lg:min-h-[400px]">
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <a
              href="/"
              target="_blank"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold">View Live Site</h3>
                  <p className="text-amber-100 text-xs lg:text-sm mt-1">See how customers view your gallery</p>
                </div>
                <HomeIcon className="h-6 w-6 lg:h-8 lg:w-8" />
              </div>
            </a>

            <button
              onClick={() => setActiveTab('add')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold">Add New Art</h3>
                  <p className="text-green-100 text-xs lg:text-sm mt-1">Upload your latest creation</p>
                </div>
                <PaintBrushIcon className="h-6 w-6 lg:h-8 lg:w-8" />
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}