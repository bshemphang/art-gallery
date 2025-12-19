'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { XMarkIcon, BanknotesIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';

export default function PaintingModal({ isOpen, closeModal, painting }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save order to database
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            painting_id: painting.id,
            painting_title: painting.title,
            painting_price: painting.price,
            customer_name: orderData.name,
            customer_email: orderData.email,
            customer_phone: orderData.phone,
            customer_address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
            customer_message: orderData.message,
            status: 'pending_payment',
            payment_method: 'bank_transfer'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setOrderId(data.id);
      setOrderSuccess(true);
      
      // Send confirmation email (you'll implement this later)
      // await sendOrderConfirmation(data);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setShowOrderForm(false);
    setOrderSuccess(false);
    setOrderData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      message: ''
    });
  };

  if (!painting) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <button
                  onClick={() => {
                    resetForm();
                    closeModal();
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {!showOrderForm && !orderSuccess ? (
                  // Painting Details View
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Painting Image */}
                    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={painting.image_url}
                        alt={painting.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Painting Details */}
                    <div className="space-y-6">
                      <div>
                        <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                          {painting.title}
                        </Dialog.Title>
                        <p className="mt-2 text-gray-600">{painting.medium || 'Acrylic on Canvas'}</p>
                      </div>

                      {painting.description && (
                        <div>
                          <h3 className="font-semibold text-gray-900">Description</h3>
                          <p className="mt-1 text-gray-700">{painting.description}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {painting.dimensions && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Dimensions:</span>
                            <span className="font-medium">{painting.dimensions}</span>
                          </div>
                        )}
                        
                        {painting.size && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Size:</span>
                            <span className="font-medium">{painting.size}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-3xl font-bold text-amber-700">₹{painting.price.toLocaleString()}</p>
                          </div>
                          {painting.is_sold ? (
                            <span className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-full">
                              Sold
                            </span>
                          ) : (
                            <button
                              onClick={() => setShowOrderForm(true)}
                              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            >
                              Purchase This Artwork
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : orderSuccess ? (
                  // Order Success View
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                      <BanknotesIcon className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                      Order Placed Successfully!
                    </Dialog.Title>
                    
                    <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-xl text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-semibold">ART{orderId.toString().padStart(4, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Artwork:</span>
                        <span className="font-semibold">{painting.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-amber-700">₹{painting.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="mt-8 p-6 bg-amber-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Payment Instructions</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Bank Transfer Details:</p>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="font-medium">Bank Name: [Your Bank Name]</p>
                            <p className="font-medium">Account Name: [Your Name]</p>
                            <p className="font-medium">Account Number: [Your Account Number]</p>
                            <p className="font-medium">IFSC Code: [Your IFSC Code]</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">UPI Payment:</p>
                          <div className="flex items-center gap-4 bg-white p-4 rounded-lg">
                            <QrCodeIcon className="h-8 w-8 text-gray-600" />
                            <div>
                              <p className="font-medium">UPI ID: [yourupi@bank]</p>
                              <p className="text-sm text-gray-500">Scan QR code or send to this UPI ID</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p className="font-medium mb-1">Important:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Please include Order ID (ART{orderId.toString().padStart(4, '0')}) in payment description</li>
                            <li>Artwork will be shipped after payment confirmation (usually within 24 hours)</li>
                            <li>You'll receive shipping details via email/WhatsApp</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => {
                          resetForm();
                          closeModal();
                        }}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  // Order Form View
                  <div>
                    <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900 mb-6">
                      Order Details for "{painting.title}"
                    </Dialog.Title>

                    <form onSubmit={handleOrderSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={orderData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={orderData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={orderData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={orderData.pincode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complete Address *
                        </label>
                        <textarea
                          name="address"
                          value={orderData.address}
                          onChange={handleInputChange}
                          required
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="House no, Street, Area"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={orderData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={orderData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={orderData.message}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Any special requests or questions..."
                        />
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setShowOrderForm(false)}
                          className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
                        >
                          Back
                        </button>
                        
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Placing Order...' : 'Place Order & Get Payment Details'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}