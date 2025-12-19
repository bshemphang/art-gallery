'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ConfirmationModal from '@/components/ConfirmationModal';
import { 
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function ManagePaintingsPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('delete'); // 'delete' or 'sold'
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchPaintings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paintings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaintings(data || []);
    } catch (error) {
      console.error('Error fetching paintings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  const confirmDelete = (painting) => {
    setSelectedPainting(painting);
    setModalType('delete');
    setModalTitle('Delete Artwork');
    setModalMessage(`Are you sure you want to delete "${painting.title}"? This action cannot be undone.`);
    setModalOpen(true);
  };

  const confirmToggleSold = (painting) => {
    setSelectedPainting(painting);
    setModalType(painting.is_sold ? 'available' : 'sold');
    setModalTitle(painting.is_sold ? 'Mark as Available' : 'Mark as Sold');
    setModalMessage(
      painting.is_sold 
        ? `Mark "${painting.title}" as available again?`
        : `Mark "${painting.title}" as sold?`
    );
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPainting) return;
    
    console.log('Deleting painting:', selectedPainting.title);
    
    try {
      const imageUrl = selectedPainting.image_url;
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const fileName = pathname.split('/').pop();
      
      try {
        await supabase.storage
          .from('paintings')
          .remove([fileName]);
        console.log('Storage file deleted');
      } catch (storageErr) {
        console.warn('Storage cleanup failed (non-critical):', storageErr);
      }
      
      const { error: dbError } = await supabase
        .from('paintings')
        .delete()
        .eq('id', selectedPainting.id);

      if (dbError) throw dbError;
      
      console.log('Database record deleted');
      
      const newPaintings = paintings.filter(p => p.id !== selectedPainting.id);
      setPaintings(newPaintings);
      
      alert('✅ Artwork deleted successfully!');
      
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert('Delete failed. Check console for details.');
    }
  };

  const handleToggleSold = async () => {
    if (!selectedPainting) return;
    
    try {
      const newSoldStatus = !selectedPainting.is_sold;
      
      const { error } = await supabase
        .from('paintings')
        .update({ 
          is_sold: newSoldStatus,
          sold_at: newSoldStatus ? new Date().toISOString() : null
        })
        .eq('id', selectedPainting.id);

      if (error) throw error;
      
      setPaintings(paintings.map(p => 
        p.id === selectedPainting.id 
          ? { ...p, is_sold: newSoldStatus }
          : p
      ));
      
      alert(
        newSoldStatus
          ? `"${selectedPainting.title}" marked as sold.`
          : `"${selectedPainting.title}" marked as available.`
      );
    } catch (error) {
      console.error('Error updating painting:', error);
      alert('Failed to update artwork status. Please try again.');
    }
  };

  const handleModalConfirm = () => {
    if (modalType === 'delete') {
      handleDelete();
    } else {
      handleToggleSold();
    }
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Artworks</h2>
          <p className="text-gray-600 mt-2">Edit, delete, or mark artworks as sold</p>
        </div>
        <button
          onClick={fetchPaintings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-500">Loading artworks...</p>
        </div>
      ) : paintings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <EyeIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No artworks found</h3>
          <p className="text-gray-600 mt-1">Add your first artwork to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paintings.map((painting) => (
            <div key={painting.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="h-48 relative bg-gradient-to-br from-amber-50 to-orange-50">
                <img
                  src={painting.image_url}
                  alt={painting.title}
                  className="h-full w-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {painting.is_sold ? (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      Sold
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Available
                    </span>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{painting.title}</h3>
                
                {painting.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {painting.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xl font-bold text-amber-700">₹{painting.price}</p>
                    {painting.dimensions && (
                      <p className="text-sm text-gray-500">{painting.dimensions}</p>
                    )}
                    {painting.is_sold && painting.sold_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Sold on {formatDate(painting.sold_at)}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmToggleSold(painting)}
                      className={`p-2 rounded-lg ${
                        painting.is_sold
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                      title={painting.is_sold ? 'Mark as Available' : 'Mark as Sold'}
                    >
                      {painting.is_sold ? (
                        <XCircleIcon className="h-5 w-5" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => confirmDelete(painting)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Delete Artwork"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                  <span>Added: {formatDate(painting.created_at)}</span>
                  <span>ID: #{painting.id.toString().slice(-4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalType === 'delete' ? 'Delete Artwork' : modalType === 'sold' ? 'Mark as Sold' : 'Mark Available'}
        cancelText="Cancel"
      />
    </>
  );
}