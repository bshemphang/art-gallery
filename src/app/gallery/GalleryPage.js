'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PaintingModal from '@/components/PaintingModal';
import { 
  FunnelIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState(null);

  function openModal(painting) {
    setSelectedPainting(painting);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPainting(null), 300);
  }

  useEffect(() => {
    async function fetchPaintings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('paintings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching paintings:', error);
      } else {
        setPaintings(data);
      }
      setLoading(false);
    }
    fetchPaintings();
  }, []);

  const filteredPaintings = paintings.filter(painting => {
    if (filter === 'available') return !painting.is_sold;
    if (filter === 'sold') return painting.is_sold;
    return true; 
  });

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Home
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Art Gallery</h1>
                <p className="text-gray-600 mt-2">Browse all available artworks in the collection</p>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'all' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <SparklesIcon className="h-4 w-4" />
                  All Artworks ({paintings.length})
                </button>
                <button
                  onClick={() => setFilter('available')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'available' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  Available ({paintings.filter(p => !p.is_sold).length})
                </button>
                <button
                  onClick={() => setFilter('sold')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    filter === 'sold' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <FunnelIcon className="h-4 w-4" />
                  Sold ({paintings.filter(p => p.is_sold).length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
              <p className="mt-4 text-gray-500">Loading artworks...</p>
            </div>
          ) : filteredPaintings.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block h-24 w-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                <SparklesIcon className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No artworks found</h3>
              <p className="text-gray-600 mt-2">
                {filter === 'available' 
                  ? "All artworks are currently sold. Check back soon for new pieces!" 
                  : "No artworks match your filter."}
              </p>
              <button
                onClick={() => setFilter('all')}
                className="mt-6 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600"
              >
                View All Artworks
              </button>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredPaintings.length}</span> artwork
                  {filteredPaintings.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` (${filter === 'available' ? 'Available' : 'Sold'})`}
                </p>
              </div>

              {/* Artworks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPaintings.map((painting) => (
                  <div 
                    key={painting.id} 
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => openModal(painting)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <Image 
                        src={painting.image_url} 
                        alt={painting.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      
                      {/* Status Badge */}
                      {painting.is_sold ? (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                          Sold
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Available
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-1">
                        {painting.title}
                      </h3>
                      
                      {painting.medium && (
                        <p className="text-sm text-gray-600 mt-1">{painting.medium}</p>
                      )}
                      
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xl font-bold text-amber-700">₹{painting.price.toLocaleString()}</span>
                        {painting.dimensions && (
                          <span className="text-sm text-gray-500">{painting.dimensions}</span>
                        )}
                      </div>
                      
                      <button className="mt-4 w-full py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-12 pt-8 border-t border-amber-100 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </main>

      <PaintingModal 
        key={selectedPainting ? selectedPainting.id : 'empty-modal'}
        isOpen={isModalOpen}
        closeModal={closeModal}
        painting={selectedPainting}
      />
    </>
  );
}