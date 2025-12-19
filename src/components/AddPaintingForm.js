'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  PhotoIcon, 
  CurrencyRupeeIcon, 
  ArrowsPointingOutIcon,
  TagIcon,
  DocumentTextIcon,
  CloudArrowUpIcon 
} from '@heroicons/react/24/outline';

export default function AddPaintingForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!imageFile) {
      setError('Please select an image of your artwork');
      setLoading(false);
      return;
    }

    try {
      const filePath = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('paintings')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('paintings')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Could not get image URL');
      }
      
      const { error: insertError } = await supabase
        .from('paintings')
        .insert({
          title,
          description,
          dimensions,
          price: parseFloat(price),
          image_url: publicUrl,
          is_sold: false,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw insertError;
      }
      setSuccess('🎨 Artwork added successfully! It will appear on your gallery.');
      
      setTitle('');
      setDescription('');
      setDimensions('');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
      e.target.reset();
      
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

    } catch (error) {
      console.error('Error adding painting:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm">
      <div className="p-6 border-b border-amber-50">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <PhotoIcon className="h-7 w-7 text-amber-500" />
          Add New Artwork
        </h3>
        <p className="text-gray-600 mt-2">Share your latest creation with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Image Upload Preview */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <CloudArrowUpIcon className="h-5 w-5 text-amber-600" />
            Artwork Image
          </label>
          
          {imagePreview ? (
            <div className="relative aspect-square max-w-md mx-auto">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-xl border-2 border-amber-200"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  URL.revokeObjectURL(imagePreview);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-amber-200 rounded-2xl p-12 text-center bg-gradient-to-br from-amber-50 to-orange-50 cursor-pointer hover:border-amber-300 transition-colors">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <PhotoIcon className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-700 font-medium">Click to upload image</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                required
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Title & Medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-amber-600" />
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Sunset Dreams"
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 text-amber-600" />
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Tell the story behind this artwork..."
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* Dimensions & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <ArrowsPointingOutIcon className="h-4 w-4 text-amber-600" />
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g., 24 x 36 inches"
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CurrencyRupeeIcon className="h-4 w-4 text-amber-600" />
              Price (₹)
            </label>
            <div className="relative">
              <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="1"
                placeholder="2500"
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>{success}</div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-amber-50">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading Artwork...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5" />
                Publish Artwork
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Your artwork will appear on the gallery after upload
          </p>
        </div>
      </form>
    </div>
  );
}