'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { useMarketplaceStore } from '@/store/marketplace-store';
import Header from '@/components/Header';
import MessagingInterface from '@/components/MessagingInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  Heart, 
  Clock, 
  DollarSign, 
  Star, 
  MessageCircle, 
  Plus,
  Calendar,
  Package,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

interface TransportRequest {
  id: string;
  origin_location: string;
  destination_location: string;
  pickup_date: string;
  pet_name: string;
  pet_type: string;
  pet_size: string;
  budget: number;
  status: 'active' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  bids?: Bid[];
}

interface Bid {
  id: string;
  transporter_id: string;
  amount: number;
  pickup_date: string;
  delivery_date: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  transporter_profile?: {
    first_name: string;
    last_name: string;
    company_name?: string;
    rating?: number;
    completed_trips?: number;
  };
}

interface Pet {
  id: string;
  name: string;
  species: string;
  age_years?: number;
  weight?: number;
  weight_unit: string;
  special_needs?: string;
}

function EnhancedCustomerDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
  const [showBidDetails, setShowBidDetails] = useState(false);

  useEffect(() => {
    // Check for success message
    const success = searchParams.get('success');
    if (success === 'quote-submitted') {
      setSuccessMessage('Your quote request has been submitted! Transporters will start sending bids soon.');
      router.replace('/dashboard/enhanced', { scroll: false });
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
        console.error('Error fetching user profile:', error);
        if (error.code === 'PGRST116') {
          router.push('/onboarding/enhanced');
          return;
        }
      }

      if (profile?.user_type === 'transporter') {
        router.push('/transporter-dashboard');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error checking user type:', error);
      fetchData();
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchTransportRequests(), fetchUserPets()]);
    setLoading(false);
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
              company_name
            )
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching transport requests:', error);
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
        .update({ status: 'rejected' })
        .eq('request_id', requestId)
        .neq('id', bidId);

      if (declineError) throw declineError;

      await fetchTransportRequests();
      setSuccessMessage('Bid accepted! The transporter will be notified and you can proceed with booking.');
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('Error accepting bid. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'matched': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'matched': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Manage your pet transport requests and track your journeys
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-green-800">{successMessage}</p>
                <button 
                  onClick={() => setSuccessMessage('')}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Requests</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {requests.filter(r => r.status === 'active').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold text-green-600">
                      {requests.reduce((acc, req) => acc + (req.bids?.length || 0), 0)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {requests.filter(r => r.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registered Pets</p>
                    <p className="text-2xl font-bold text-red-600">{pets.length}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="pets">My Pets</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Transport Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Transport Requests</h2>
                <Button 
                  onClick={() => router.push('/request-quote/enhanced')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </div>

              {requests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transport requests yet</h3>
                    <p className="text-gray-600 mb-6">Get started by requesting a quote for your pet's journey</p>
                    <Button 
                      onClick={() => router.push('/request-quote/enhanced')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Create Your First Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {requests.map((request) => (
                    <Card key={request.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.pet_name} - {request.pet_type}
                              </h3>
                              <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                                {getStatusIcon(request.status)}
                                {request.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{request.origin_location} → {request.destination_location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(request.pickup_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Budget: ${request.budget}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {request.bids && request.bids.length > 0 && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {request.bids.length} Bid{request.bids.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Transport Request - {request.pet_name}
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  {/* Request Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-sm">Trip Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2 text-sm">
                                        <div><strong>From:</strong> {request.origin_location}</div>
                                        <div><strong>To:</strong> {request.destination_location}</div>
                                        <div><strong>Pickup:</strong> {new Date(request.pickup_date).toLocaleDateString()}</div>
                                        <div><strong>Budget:</strong> ${request.budget}</div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-sm">Pet Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {request.pet_name}</div>
                                        <div><strong>Type:</strong> {request.pet_type}</div>
                                        <div><strong>Size:</strong> {request.pet_size}</div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Bids Section */}
                                  {request.bids && request.bids.length > 0 && (
                                    <div>
                                      <h3 className="text-lg font-semibold mb-4">
                                        Received Bids ({request.bids.length})
                                      </h3>
                                      <div className="space-y-4">
                                        {request.bids.map((bid) => (
                                          <Card key={bid.id} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                              <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-3 mb-2">
                                                    <Avatar className="w-10 h-10">
                                                      <AvatarFallback className="bg-blue-500 text-white">
                                                        {bid.transporter_profile?.first_name?.charAt(0)}
                                                        {bid.transporter_profile?.last_name?.charAt(0)}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                      <h4 className="font-semibold">
                                                        {bid.transporter_profile?.first_name} {bid.transporter_profile?.last_name}
                                                      </h4>
                                                      {bid.transporter_profile?.company_name && (
                                                        <p className="text-sm text-gray-600">
                                                          {bid.transporter_profile.company_name}
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>
                                                  
                                                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                                    <div><strong>Price:</strong> ${bid.amount}</div>
                                                    <div><strong>Pickup:</strong> {new Date(bid.pickup_date).toLocaleDateString()}</div>
                                                    <div><strong>Delivery:</strong> {new Date(bid.delivery_date).toLocaleDateString()}</div>
                                                    <div>
                                                      <Badge className={
                                                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                      }>
                                                        {bid.status}
                                                      </Badge>
                                                    </div>
                                                  </div>
                                                  
                                                  {bid.message && (
                                                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                                                      {bid.message}
                                                    </p>
                                                  )}
                                                </div>
                                                
                                                {bid.status === 'pending' && request.status === 'active' && (
                                                  <div className="flex gap-2 ml-4">
                                                    <Button 
                                                      size="sm"
                                                      onClick={() => acceptBid(bid.id, request.id)}
                                                      className="bg-green-600 hover:bg-green-700"
                                                    >
                                                      Accept
                                                    </Button>
                                                    <Button 
                                                      size="sm"
                                                      variant="outline"
                                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                                    >
                                                      Decline
                                                    </Button>
                                                  </div>
                                                )}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {request.bids?.length === 0 && (
                                    <div className="text-center py-8">
                                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Waiting for Bids
                                      </h3>
                                      <p className="text-gray-600">
                                        Transporters typically respond within 24 hours
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pets Tab */}
            <TabsContent value="pets" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Pets</h2>
                <Button 
                  onClick={() => router.push('/onboarding/pets')}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pet
                </Button>
              </div>

              {pets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets added yet</h3>
                    <p className="text-gray-600 mb-6">Add your pets to get personalized transport options</p>
                    <Button 
                      onClick={() => router.push('/onboarding/pets')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Add Your First Pet
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {pet.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                              <Badge variant="secondary" className="capitalize">
                                {pet.species}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          {pet.age_years && (
                            <div><strong>Age:</strong> {pet.age_years} years old</div>
                          )}
                          {pet.weight && (
                            <div><strong>Weight:</strong> {pet.weight} {pet.weight_unit}</div>
                          )}
                          {pet.special_needs && (
                            <div className="mt-3">
                              <strong className="text-orange-600">Special Needs:</strong>
                              <p className="text-orange-600 mt-1">{pet.special_needs}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Messages</h2>
                <Badge className="bg-green-100 text-green-800">Live</Badge>
              </div>

              <MessagingInterface 
                currentUserId={user?.id || ''}
                currentUserName={`${user?.firstName} ${user?.lastName}` || 'You'}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function EnhancedCustomerDashboardWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EnhancedCustomerDashboard />
    </Suspense>
  );
}