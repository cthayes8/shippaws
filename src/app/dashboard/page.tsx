'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { TransportRequest, Bid, Pet } from '@/lib/supabase';
import Header from '@/components/Header';

interface ExtendedBid extends Bid {
  transporter_profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

interface ExtendedTransportRequest extends TransportRequest {
  bids?: ExtendedBid[];
}

function PetOwnerDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [requests, setRequests] = useState<ExtendedTransportRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message
    const success = searchParams.get('success');
    if (success === 'quote-submitted') {
      setSuccessMessage('Your quote request has been submitted! Transporters will start sending bids soon.');
      // Clear the URL parameters
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (user?.id) {
      checkUserTypeAndRedirect();
    }
  }, [user?.id]);

  const checkUserTypeAndRedirect = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If no profile exists (PGRST116), redirect to onboarding
        if (error.code === 'PGRST116') {
          console.log('No profile found, redirecting to onboarding');
          router.push('/onboarding');
          return;
        }
        
        // For other errors, try to proceed anyway
        fetchTransportRequests();
        fetchUserPets();
        return;
      }

      if (profile?.user_type === 'transporter') {
        router.push('/transporter-dashboard');
        return;
      }

      fetchTransportRequests();
      fetchUserPets();
    } catch (error) {
      console.error('Error checking user type:', error);
      // Fallback: try to proceed anyway
      fetchTransportRequests();
      fetchUserPets();
    }
  };

  const fetchUserPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchTransportRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_requests')
        .select(`
          *,
          bids(
            *,
            transporter_profile:profiles!bids_transporter_id_fkey(
              first_name,
              last_name,
              phone
            )
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching transport requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (bidId: string, requestId: string) => {
    try {
      // Update bid status to accepted
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (bidError) throw bidError;

      // Update request status to matched
      const { error: requestError } = await supabase
        .from('transport_requests')
        .update({ status: 'matched' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Decline all other bids for this request
      const { error: declineError } = await supabase
        .from('bids')
        .update({ status: 'declined' })
        .eq('request_id', requestId)
        .neq('id', bidId);

      if (declineError) throw declineError;

      // Refresh the data
      fetchTransportRequests();
      
      alert('Bid accepted! The transporter will be notified and you can proceed with booking.');
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('Error accepting bid. Please try again.');
    }
  };

  const declineBid = async (bidId: string) => {
    try {
      const { error } = await supabase
        .from('bids')
        .update({ status: 'declined' })
        .eq('id', bidId);

      if (error) throw error;

      fetchTransportRequests();
    } catch (error) {
      console.error('Error declining bid:', error);
      alert('Error declining bid. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Pets Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Pets</h2>
            <Link
              href="/onboarding/pets"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              Add Pet
            </Link>
          </div>
          
          {pets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-dashed border-gray-300">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No pets added yet</h3>
                <p className="text-gray-600 text-sm mb-4">Add your pets to get personalized transport options</p>
                <Link
                  href="/onboarding/pets"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Add Your First Pet
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {pet.species}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {(pet.age_years || pet.age_months) && (
                      <p>
                        Age: {pet.age_years ? `${pet.age_years} years` : ''} {pet.age_months ? `${pet.age_months} months` : ''}
                      </p>
                    )}
                    {pet.weight && (
                      <p>Weight: {pet.weight} {pet.weight_unit}</p>
                    )}
                    {pet.special_needs && (
                      <p className="text-orange-600">
                        <span className="font-medium">Special needs:</span> {pet.special_needs}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Transport Requests</h1>
            <p className="text-gray-600 mt-2">Manage your pet transportation requests and bids</p>
          </div>
          <Link
            href="/request-quote"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            New Quote Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transport requests yet</h3>
              <p className="text-gray-600 mb-6">Get started by requesting a quote for your pet&apos;s journey</p>
              <Link
                href="/request-quote"
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Request Your First Quote
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.pet_name || 'Pet'} Transport - {request.origin_zip} to {request.destination_zip}
                      </h3>
                      <p className="text-gray-600">
                        {request.pet_type} • {request.pet_size} • {new Date(request.preferred_date || '').toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'matched' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  {request.special_instructions && (
                    <p className="text-gray-700">
                      <span className="font-medium">Special instructions:</span> {request.special_instructions}
                    </p>
                  )}
                </div>

                {request.bids && request.bids.length > 0 ? (
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Bids ({request.bids.length})
                    </h4>
                    <div className="space-y-4">
                      {request.bids.map((bid) => (
                        <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {bid.transporter_profile?.first_name} {bid.transporter_profile?.last_name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                Pickup: {new Date(bid.pickup_date).toLocaleDateString()} • 
                                Delivery: {new Date(bid.delivery_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">${bid.price}</div>
                              <span className={`text-sm ${
                                bid.status === 'accepted' ? 'text-green-600' :
                                bid.status === 'declined' ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {bid.status}
                              </span>
                            </div>
                          </div>
                          
                          {bid.message && (
                            <p className="text-gray-700 text-sm mb-3">{bid.message}</p>
                          )}

                          {bid.status === 'pending' && request.status === 'active' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => acceptBid(bid.id, request.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm font-medium"
                              >
                                Accept Bid
                              </button>
                              <button
                                onClick={() => declineBid(bid.id)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm font-medium"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>No bids received yet. Transporters typically respond within 24 hours.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <PetOwnerDashboard />
    </Suspense>
  );
}