'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Masonry from 'react-masonry-css';
import './masonry.css';
import PaintingModal from '@/components/PaintingModal';
import { 
  PaintBrushIcon, 
  CreditCardIcon, 
  TruckIcon, 
  MapPinIcon,
  HeartIcon,
  StarIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching paintings:', error);
    } else {
      setPaintings(data);
    }
    setLoading(false);
  }

  fetchPaintings();

  const channel = supabase
    .channel('paintings-changes')
    .on(
      'postgres_changes',
      {
        event: '*', 
        schema: 'public',
        table: 'paintings'
      },
      (payload) => {
        console.log('Real-time update:', payload);
        fetchPaintings(); 
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Section */}
        <section className="relative px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Handmade Art,
              <span className="block text-amber-600 mt-2">Straight from the Heart</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Original paintings and drawings created with passion. 
              Each piece tells a story and brings warmth to your home.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#artworks" 
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                See Artworks
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 bg-white text-amber-700 border border-amber-300 font-medium rounded-lg hover:bg-amber-50 transition-colors"
              >
                Contact Artist
              </a>
            </div>
          </div>
        </section>

        {/* Artist Introduction */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center p-8">
                    <PaintBrushIcon className="h-24 w-24 text-amber-500" />
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <h2 className="text-3xl font-bold text-gray-900">Hello, I'm [Artist Name]</h2>
                  <p className="mt-4 text-gray-700 text-lg">
                    I'm a self-taught artist from [Your City, India]. For the past few years, 
                    I've been creating art that captures emotions, local scenes, and everyday beauty. 
                    Every piece is made by hand, with attention to detail and love for the craft.
                  </p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <HeartIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Made with Love</p>
                        <p className="text-sm text-gray-600">Every piece is special</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <MapPinIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Local Artist</p>
                        <p className="text-sm text-gray-600">Based in [Your City]</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artworks Section */}
        <section id="artworks" className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">My Latest Artworks</h2>
              <p className="mt-2 text-gray-600">Choose from available pieces or request a custom painting</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-pulse bg-gradient-to-r from-amber-200 to-orange-200 h-48 w-48 rounded-lg"></div>
                <p className="mt-4 text-gray-500">Loading artworks...</p>
              </div>
            ) : (
              <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {paintings.map((painting) => (
                  <div key={painting.id} className="mb-6" onClick={() => openModal(painting)}>
                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <Image 
                          src={painting.image_url} 
                          alt={painting.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {painting.is_sold && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                            Sold
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700">
                          {painting.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">{painting.medium || 'Acrylic on Canvas'}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-2xl font-bold text-amber-700">₹{painting.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">{painting.size || 'Various sizes'}</span>
                        </div>
                        <button className="mt-4 w-full py-2 bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            )}
            
            <div className="text-center mt-12">
              <Link 
                href="/gallery" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors"
              >
                View All Artworks
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How to Buy */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How to Buy Art</h2>
              <p className="mt-2 text-gray-600">Simple process, direct from artist to you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-amber-100 rounded-full mb-4">
                  <div className="h-12 w-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold">1</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Art</h3>
                <p className="text-gray-600">
                  Browse available paintings or message me for custom work
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-amber-100 rounded-full mb-4">
                  <div className="h-12 w-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold">2</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Place Order</h3>
                <p className="text-gray-600">
                  Message me to confirm availability and place your order
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-amber-100 rounded-full mb-4">
                  <div className="h-12 w-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-bold">3</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Delivery</h3>
                <p className="text-gray-600">
                  Safe packaging and delivery across India. Cash on delivery available
                </p>
              </div>
            </div>
            
            {/* Important Notes */}
            <div className="mt-16 bg-amber-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment & Shipping</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">Bank Transfer / UPI / NEFT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <p className="text-gray-700">Free delivery in [Your City] area</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <p className="text-gray-700">Shipping across India</p>
                </div>
              </div>
              
              {/* Add payment methods */}
              <div className="mt-6 pt-6 border-t border-amber-200">
                <p className="text-sm text-gray-600 mb-2">Accepted Payment Methods:</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-white border border-amber-300 text-amber-700 text-sm rounded-full">UPI</span>
                  <span className="px-3 py-1 bg-white border border-amber-300 text-amber-700 text-sm rounded-full">Bank Transfer</span>
                  <span className="px-3 py-1 bg-white border border-amber-300 text-amber-700 text-sm rounded-full">NEFT</span>
                  <span className="px-3 py-1 bg-white border border-amber-300 text-amber-700 text-sm rounded-full">IMPS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
                <p className="mt-2 text-gray-600">Have questions or want a custom painting?</p>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">[Your Email Address]</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">[Your City, State], India</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    I'm usually available to chat about art, commissions, or any questions you might have. 
                    Feel free to reach out via WhatsApp or email.
                  </p>
                  <a 
                    href="https://wa.me/[YourPhoneNumber]" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-amber-300">[Artist Name] Art</h3>
                <p className="mt-2 text-gray-400">Handmade paintings from [Your City], India</p>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400">© {new Date().getFullYear()} All artworks are original creations</p>
                <div className="mt-4">
                  <Link 
                    href="/admin/login" 
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Artist Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
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