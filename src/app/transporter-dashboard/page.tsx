'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { TransportRequest, Bid } from '@/lib/supabase';

interface BidBasic {
  id: string;
  transporter_id: string;
  status: string;
}

interface ExtendedTransportRequest extends TransportRequest {
  profiles?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  bids?: BidBasic[];
  existing_bid?: Bid;
}

interface BidWithRequest {
  id: string;
  price: number;
  pickup_date: string;
  delivery_date: string;
  message?: string;
  status: string;
  created_at: string;
  transport_requests?: {
    id: string;
    pet_name?: string;
    origin_zip: string;
    destination_zip: string;
    pet_type: string;
    pet_size: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function TransporterDashboard() {
  const { user } = useUser();
  const router = useRouter();
  
  const [requests, setRequests] = useState<ExtendedTransportRequest[]>([]);
  const [myBids, setMyBids] = useState<BidWithRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransporter, setIsTransporter] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [bidForm, setBidForm] = useState<{
    requestId: string;
    price: string;
    pickupDate: string;
    deliveryDate: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user?.id) {
      checkTransporterStatus();
    }
  }, [user?.id]);

  const checkTransporterStatus = async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.user_type !== 'transporter') {
        router.push('/dashboard');
        return;
      }

      const { data: transporterProfile, error: transporterError } = await supabase
        .from('transporter_profiles')
        .select('is_approved')
        .eq('id', user?.id)
        .single();

      if (transporterError) throw transporterError;

      if (!transporterProfile?.is_approved) {
        alert('Your transporter account is pending approval. Please wait for admin approval.');
        router.push('/transporters/onboard');
        return;
      }

      setIsTransporter(true);
      fetchAvailableRequests();
      fetchMyBids();
    } catch (error) {
      console.error('Error checking transporter status:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_requests')
        .select(`
          *,
          profiles!transport_requests_user_id_fkey(
            first_name,
            last_name,
            phone
          ),
          bids(id, transporter_id, status)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add existing bid info for this transporter
      const requestsWithBids = data?.map(request => {
        const existingBid = request.bids?.find((bid: BidBasic) => bid.transporter_id === user?.id);
        return {
          ...request,
          existing_bid: existingBid
        };
      }) || [];

      setRequests(requestsWithBids);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchMyBids = async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          transport_requests(
            *,
            profiles!transport_requests_user_id_fkey(
              first_name,
              last_name,
              phone
            )
          )
        `)
        .eq('transporter_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const submitBid = async () => {
    if (!bidForm) return;

    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          request_id: bidForm.requestId,
          transporter_id: user?.id,
          price: parseFloat(bidForm.price),
          pickup_date: bidForm.pickupDate,
          delivery_date: bidForm.deliveryDate,
          message: bidForm.message || null,
          status: 'pending'
        });

      if (error) throw error;

      setBidForm(null);
      fetchAvailableRequests();
      fetchMyBids();
      alert('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isTransporter) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/SP - Logo1.png"
              alt="Ship Paws"
              width={120}
              height={60}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.firstName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transporter Dashboard</h1>
          <p className="text-gray-600 mt-2">Find transport requests and manage your bids</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Requests ({requests.length})
            </button>
            <button 
              onClick={() => setActiveTab('mybids')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mybids' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Bids ({myBids.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'available' ? (
            // Available Requests Tab
            requests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No transport requests available</h3>
                  <p className="text-gray-600">Check back later for new transport opportunities</p>
                </div>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.pet_name || 'Pet'} Transport
                        </h3>
                        <p className="text-gray-600">
                          {request.origin_zip} → {request.destination_zip} • {request.pet_type} • {request.pet_size}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Preferred Date: {new Date(request.preferred_date || '').toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Requested by</p>
                        <p className="font-medium">{request.profiles?.first_name} {request.profiles?.last_name}</p>
                      </div>
                    </div>

                    {request.special_instructions && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Special instructions:</span> {request.special_instructions}
                        </p>
                      </div>
                    )}

                    {request.existing_bid ? (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">You have already submitted a bid for this request</p>
                        <p className="text-blue-600 text-sm">Status: {request.existing_bid.status}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setBidForm({
                          requestId: request.id,
                          price: '',
                          pickupDate: '',
                          deliveryDate: '',
                          message: ''
                        })}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        Submit Bid
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            // My Bids Tab
            myBids.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids submitted yet</h3>
                  <p className="text-gray-600">Start bidding on transport requests to see them here</p>
                </div>
              </div>
            ) : (
              myBids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bid.transport_requests?.pet_name || 'Pet'} Transport
                        </h3>
                        <p className="text-gray-600">
                          {bid.transport_requests?.origin_zip} → {bid.transport_requests?.destination_zip} • {bid.transport_requests?.pet_type} • {bid.transport_requests?.pet_size}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Your pickup: {new Date(bid.pickup_date).toLocaleDateString()} • Delivery: {new Date(bid.delivery_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${bid.price}</div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          bid.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>

                    {bid.message && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Your message:</span> {bid.message}
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      Pet owner: {bid.transport_requests?.profiles?.first_name} {bid.transport_requests?.profiles?.last_name}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </main>

      {/* Bid Form Modal */}
      {bidForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Bid</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bidForm.price}
                  onChange={(e) => setBidForm(prev => prev ? {...prev, price: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Enter your bid amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  value={bidForm.pickupDate}
                  onChange={(e) => setBidForm(prev => prev ? {...prev, pickupDate: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={bidForm.deliveryDate}
                  onChange={(e) => setBidForm(prev => prev ? {...prev, deliveryDate: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                  min={bidForm.pickupDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={bidForm.message}
                  onChange={(e) => setBidForm(prev => prev ? {...prev, message: e.target.value} : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Any additional details or questions..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={submitBid}
                disabled={!bidForm.price || !bidForm.pickupDate || !bidForm.deliveryDate}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Bid
              </button>
              <button
                onClick={() => setBidForm(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}