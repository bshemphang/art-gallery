'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  BanknotesIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

export default function OrdersPageContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      alert('Order status updated!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_payment: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Payment' },
      payment_received: { color: 'bg-blue-100 text-blue-800', text: 'Payment Received' },
      processing: { color: 'bg-purple-100 text-purple-800', text: 'Processing' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Orders</h2>
          <p className="text-gray-600 mt-2">Manage orders and update their status</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BanknotesIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="text-gray-600 mt-1">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Order #{order.id.toString().padStart(4, '0')}</h3>
                  <p className="text-sm text-gray-600">{order.painting_title}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-lg font-bold text-amber-700">₹{order.painting_price.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h4>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.customer_email}</p>
                  <p className="text-sm text-gray-600">{order.customer_phone}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{order.customer_address}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Order Info</h4>
                  <p className="text-sm text-gray-600">Placed: {formatDate(order.created_at)}</p>
                  <p className="text-sm text-gray-600">Payment: {order.payment_method || 'Bank Transfer'}</p>
                  {order.payment_reference && (
                    <p className="text-sm text-gray-600">Reference: {order.payment_reference}</p>
                  )}
                </div>
              </div>

              {order.customer_message && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Message</h4>
                  <p className="text-gray-700">{order.customer_message}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Order ID: ART{order.id.toString().padStart(4, '0')}
                </div>
                
                <div className="flex gap-3">
                  {order.status === 'pending_payment' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'payment_received')}
                      className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200"
                    >
                      Mark as Paid
                    </button>
                  )}
                  
                  {order.status === 'payment_received' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200"
                    >
                      Start Processing
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200"
                    >
                      Mark as Shipped
                    </button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  
                  {(order.status === 'pending_payment' || order.status === 'payment_received') && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}