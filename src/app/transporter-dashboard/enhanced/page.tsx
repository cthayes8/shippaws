'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Package, 
  Star,
  Filter,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  Plus
} from 'lucide-react';

interface TransportRequest {
  id: string;
  customer_id: string;
  origin_location: string;
  destination_location: string;
  pickup_date: string;
  delivery_date?: string;
  pet_name: string;
  pet_type: string;
  pet_size: string;
  pet_weight?: number;
  budget: number;
  special_requirements?: string;
  status: string;
  created_at: string;
  distance?: number;
  customer_profile?: {
    first_name: string;
    last_name: string;
  };
}

interface Bid {
  id: string;
  request_id: string;
  amount: number;
  pickup_date: string;
  delivery_date: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  transport_request?: {
    pet_name: string;
    pet_type: string;
    origin_location: string;
    destination_location: string;
    customer_profile?: {
      first_name: string;
      last_name: string;
    };
  };
}

interface BidFormData {
  requestId: string;
  amount: string;
  pickupDate: string;
  deliveryDate: string;
  message: string;
}

function EnhancedTransporterDashboard() {
  const { user } = useUser();
  const router = useRouter();
  
  const [availableRequests, setAvailableRequests] = useState<TransportRequest[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  
  // Filters
  const [searchLocation, setSearchLocation] = useState('');
  const [petTypeFilter, setPetTypeFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [bidForm, setBidForm] = useState<BidFormData>({
    requestId: '',
    amount: '',
    pickupDate: '',
    deliveryDate: '',
    message: ''
  });

  useEffect(() => {
    if (user?.id) {
      checkUserTypeAndFetchData();
    }
  }, [user?.id]);

  const checkUserTypeAndFetchData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (error || !profile) {
        router.push('/onboarding/enhanced');
        return;
      }

      if (profile.user_type !== 'transporter') {
        router.push('/dashboard/enhanced');
        return;
      }

      await Promise.all([fetchAvailableRequests(), fetchMyBids()]);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user type:', error);
      setLoading(false);
    }
  };

  const fetchAvailableRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_requests')
        .select(`
          *,
          customer_profile:profiles!transport_requests_customer_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out requests that this transporter has already bid on
      const { data: existingBids } = await supabase
        .from('bids')
        .select('request_id')
        .eq('transporter_id', user?.id);

      const bidRequestIds = new Set(existingBids?.map(bid => bid.request_id) || []);
      const filteredRequests = data?.filter(request => !bidRequestIds.has(request.id)) || [];
      
      setAvailableRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching available requests:', error);
    }
  };

  const fetchMyBids = async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          transport_request:transport_requests(
            pet_name,
            pet_type,
            origin_location,
            destination_location,
            customer_profile:profiles!transport_requests_customer_id_fkey(
              first_name,
              last_name
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

  const filteredRequests = availableRequests.filter(request => {
    if (searchLocation && !request.origin_location.toLowerCase().includes(searchLocation.toLowerCase()) &&
        !request.destination_location.toLowerCase().includes(searchLocation.toLowerCase())) {
      return false;
    }
    
    if (petTypeFilter !== 'all' && request.pet_type !== petTypeFilter) {
      return false;
    }
    
    if (budgetFilter !== 'all') {
      const budget = request.budget;
      switch (budgetFilter) {
        case 'low': return budget < 500;
        case 'medium': return budget >= 500 && budget <= 1000;
        case 'high': return budget > 1000;
        default: return true;
      }
    }
    
    if (dateFilter !== 'all') {
      const pickupDate = new Date(request.pickup_date);
      const now = new Date();
      const daysDiff = Math.ceil((pickupDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      switch (dateFilter) {
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        case 'later': return daysDiff > 30;
        default: return true;
      }
    }
    
    return true;
  });

  const openBidModal = (request: TransportRequest) => {
    setSelectedRequest(request);
    setBidForm({
      requestId: request.id,
      amount: '',
      pickupDate: request.pickup_date,
      deliveryDate: request.delivery_date || '',
      message: ''
    });
    setShowBidModal(true);
  };

  const submitBid = async () => {
    if (!bidForm.amount || !bidForm.pickupDate || !bidForm.deliveryDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmittingBid(true);

    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          request_id: bidForm.requestId,
          transporter_id: user?.id,
          amount: parseFloat(bidForm.amount),
          pickup_date: bidForm.pickupDate,
          delivery_date: bidForm.deliveryDate,
          message: bidForm.message || null,
          status: 'pending'
        });

      if (error) throw error;

      setShowBidModal(false);
      await Promise.all([fetchAvailableRequests(), fetchMyBids()]);
      alert('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid. Please try again.');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
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
              Transporter Dashboard
            </h1>
            <p className="text-gray-600">
              Find transport jobs and manage your bids
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredRequests.length}</p>
                  </div>
                  <Search className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Bids</p>
                    <p className="text-2xl font-bold text-green-600">{myBids.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accepted Bids</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {myBids.filter(bid => bid.status === 'accepted').length}
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
                    <p className="text-sm font-medium text-gray-600">Win Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      {myBids.length > 0 ? Math.round((myBids.filter(bid => bid.status === 'accepted').length / myBids.length) * 100) : 0}%
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Jobs</TabsTrigger>
              <TabsTrigger value="mybids">My Bids</TabsTrigger>
            </TabsList>

            {/* Available Jobs Tab */}
            <TabsContent value="available" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="searchLocation">Location</Label>
                      <Input
                        id="searchLocation"
                        placeholder="Search by city or state"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="petTypeFilter">Pet Type</Label>
                      <Select value={petTypeFilter} onValueChange={setPetTypeFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budgetFilter">Budget Range</Label>
                      <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Budgets</SelectItem>
                          <SelectItem value="low">Under $500</SelectItem>
                          <SelectItem value="medium">$500 - $1,000</SelectItem>
                          <SelectItem value="high">Over $1,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFilter">Pickup Date</Label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="later">Later</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Listings */}
              {filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No available jobs</h3>
                    <p className="text-gray-600">
                      {availableRequests.length === 0 
                        ? "There are no transport requests available at the moment."
                        : "No jobs match your current filters. Try adjusting your search criteria."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {request.pet_name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {request.pet_name} - {request.pet_type}
                                </h3>
                                <p className="text-gray-600">
                                  {request.customer_profile?.first_name} {request.customer_profile?.last_name}
                                </p>
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {request.pet_size}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                  {request.origin_location} → {request.destination_location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(request.pickup_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                  Budget: ${request.budget}
                                </span>
                              </div>
                            </div>
                            
                            {request.special_requirements && (
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-4">
                                <strong>Special Requirements:</strong> {request.special_requirements}
                              </p>
                            )}
                          </div>
                          
                          <div className="ml-6">
                            <Button 
                              onClick={() => openBidModal(request)}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Submit Bid
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Bids Tab */}
            <TabsContent value="mybids" className="space-y-6">
              {myBids.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids submitted yet</h3>
                    <p className="text-gray-600 mb-6">Start bidding on available transport requests to grow your business</p>
                    <Button onClick={() => {
                      const availableTab = document.querySelector('[value="available"]') as HTMLElement;
                      availableTab?.click();
                    }}>
                      Browse Available Jobs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {bid.transport_request?.pet_name?.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {bid.transport_request?.pet_name} - {bid.transport_request?.pet_type}
                                </h3>
                                <p className="text-gray-600">
                                  {bid.transport_request?.customer_profile?.first_name} {bid.transport_request?.customer_profile?.last_name}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(bid.status)} flex items-center gap-1`}>
                                {getStatusIcon(bid.status)}
                                {bid.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                  {bid.transport_request?.origin_location} → {bid.transport_request?.destination_location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(bid.pickup_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                  My Bid: ${bid.amount}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Submitted: {new Date(bid.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {bid.message && (
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                <strong>My Message:</strong> {bid.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Bid Submission Modal */}
          <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Bid</DialogTitle>
              </DialogHeader>
              
              {selectedRequest && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold">{selectedRequest.pet_name}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.origin_location} → {selectedRequest.destination_location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Budget: ${selectedRequest.budget}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="bidAmount">Your Bid Amount *</Label>
                    <div className="relative">
                      <Input
                        id="bidAmount"
                        type="number"
                        placeholder="Enter your bid"
                        value={bidForm.amount}
                        onChange={(e) => setBidForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="pl-8"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bidPickupDate">Pickup Date *</Label>
                      <Input
                        id="bidPickupDate"
                        type="date"
                        value={bidForm.pickupDate}
                        onChange={(e) => setBidForm(prev => ({ ...prev, pickupDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bidDeliveryDate">Delivery Date *</Label>
                      <Input
                        id="bidDeliveryDate"
                        type="date"
                        value={bidForm.deliveryDate}
                        onChange={(e) => setBidForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                        min={bidForm.pickupDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bidMessage">Message to Pet Owner</Label>
                    <Textarea
                      id="bidMessage"
                      placeholder="Tell the pet owner about your experience and why they should choose you..."
                      value={bidForm.message}
                      onChange={(e) => setBidForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBidModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={submitBid}
                      disabled={isSubmittingBid || !bidForm.amount || !bidForm.pickupDate || !bidForm.deliveryDate}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

export default function EnhancedTransporterDashboardWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EnhancedTransporterDashboard />
    </Suspense>
  );
}