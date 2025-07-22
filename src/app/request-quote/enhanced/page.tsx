'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { useMarketplaceStore } from '@/store/marketplace-store';
import Header from '@/components/Header';
import LocationInput from '@/components/LocationInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Heart, Clock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormData {
  // Location & Timing
  originLocation: string;
  destinationLocation: string;
  pickupDate: string;
  deliveryDate: string;
  timePreference: string;
  flexibleDates: boolean;
  
  // Pet Details
  petName: string;
  petType: string;
  petSize: string;
  petWeight: string;
  petAge: string;
  specialNeeds: string;
  
  // Transport Preferences
  budget: string;
  specialRequirements: string;
  urgency: string;
}

function EnhancedRequestQuotePage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentRequest, currentRequest } = useMarketplaceStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<FormData>({
    // Location & Timing
    originLocation: '',
    destinationLocation: '',
    pickupDate: '',
    deliveryDate: '',
    timePreference: 'anytime',
    flexibleDates: false,
    
    // Pet Details
    petName: '',
    petType: '',
    petSize: '',
    petWeight: '',
    petAge: '',
    specialNeeds: '',
    
    // Transport Preferences
    budget: '',
    specialRequirements: '',
    urgency: 'standard'
  });

  useEffect(() => {
    // Check if user is signed in
    if (user === null) {
      const currentParams = new URLSearchParams(window.location.search);
      router.push(`/sign-up?redirect=${encodeURIComponent(`/request-quote/enhanced?${currentParams.toString()}`)}`);
      return;
    }

    // Load data from URL params or localStorage
    const heroFormData = localStorage.getItem('heroFormData');
    if (heroFormData) {
      const savedData = JSON.parse(heroFormData);
      setFormData(prev => ({
        ...prev,
        originLocation: savedData.originLocation || '',
        destinationLocation: savedData.destinationLocation || '',
        pickupDate: savedData.pickupDate || ''
      }));
      // Clear the saved data
      localStorage.removeItem('heroFormData');
    }

    // Check URL params
    const urlParams = {
      originLocation: searchParams.get('originLocation') || '',
      destinationLocation: searchParams.get('destinationLocation') || '',
      pickupDate: searchParams.get('pickupDate') || ''
    };

    if (urlParams.originLocation || urlParams.destinationLocation) {
      setFormData(prev => ({
        ...prev,
        ...urlParams
      }));
    }
  }, [user, searchParams, router]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.originLocation && formData.destinationLocation && formData.pickupDate);
      case 2:
        return !!(formData.petName && formData.petType && formData.petSize);
      case 3:
        return !!(formData.budget);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert('Please sign in to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_type')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        alert('Please complete your profile setup first.');
        router.push('/onboarding/enhanced');
        return;
      }

      if (profile.user_type !== 'pet_owner') {
        alert('Only pet owners can create transport requests.');
        return;
      }

      // Calculate estimated delivery date if not provided
      const deliveryDate = formData.deliveryDate || 
        new Date(new Date(formData.pickupDate).getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      // Create transport request
      const requestData = {
        customer_id: user.id,
        origin_location: formData.originLocation,
        destination_location: formData.destinationLocation,
        pickup_date: formData.pickupDate,
        delivery_date: deliveryDate,
        pet_name: formData.petName,
        pet_type: formData.petType,
        pet_size: formData.petSize,
        pet_weight: formData.petWeight ? parseFloat(formData.petWeight) : null,
        pet_age: formData.petAge ? parseInt(formData.petAge) : null,
        special_needs: formData.specialNeeds || null,
        special_requirements: formData.specialRequirements || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        time_preference: formData.timePreference,
        flexible_dates: formData.flexibleDates,
        urgency: formData.urgency,
        status: 'active',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('transport_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('Error creating transport request:', error);
        alert('Error creating your request. Please try again.');
        return;
      }

      // Update marketplace store
      setCurrentRequest(data);

      // Redirect to dashboard with success message
      router.push('/dashboard?success=quote-submitted');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Details</h2>
              <p className="text-gray-600">Where and when is your pet traveling?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocationInput
                label="Pickup Location"
                placeholder="City, State or ZIP"
                value={formData.originLocation}
                onChange={(value) => updateFormData('originLocation', value)}
                required
              />
              <LocationInput
                label="Delivery Location"
                placeholder="City, State or ZIP"
                value={formData.destinationLocation}
                onChange={(value) => updateFormData('destinationLocation', value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <div className="relative">
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => updateFormData('pickupDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div>
                <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                <div className="relative">
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => updateFormData('deliveryDate', e.target.value)}
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="timePreference">Time Preference</Label>
              <Select value={formData.timePreference} onValueChange={(value) => updateFormData('timePreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="flexibleDates"
                checked={formData.flexibleDates}
                onChange={(e) => updateFormData('flexibleDates', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="flexibleDates">I have flexible dates (+/- 3 days)</Label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Information</h2>
              <p className="text-gray-600">Tell us about your pet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="petName">Pet Name *</Label>
                <Input
                  id="petName"
                  value={formData.petName}
                  onChange={(e) => updateFormData('petName', e.target.value)}
                  placeholder="Your pet's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="petType">Pet Type *</Label>
                <Select value={formData.petType} onValueChange={(value) => updateFormData('petType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="ferret">Ferret</SelectItem>
                    <SelectItem value="reptile">Reptile</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="petSize">Size *</Label>
                <Select value={formData.petSize} onValueChange={(value) => updateFormData('petSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (0-25 lbs)</SelectItem>
                    <SelectItem value="medium">Medium (26-60 lbs)</SelectItem>
                    <SelectItem value="large">Large (61-100 lbs)</SelectItem>
                    <SelectItem value="extra-large">Extra Large (100+ lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="petWeight">Weight (lbs)</Label>
                <Input
                  id="petWeight"
                  type="number"
                  value={formData.petWeight}
                  onChange={(e) => updateFormData('petWeight', e.target.value)}
                  placeholder="Weight"
                />
              </div>
              <div>
                <Label htmlFor="petAge">Age (years)</Label>
                <Input
                  id="petAge"
                  type="number"
                  value={formData.petAge}
                  onChange={(e) => updateFormData('petAge', e.target.value)}
                  placeholder="Age"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialNeeds">Special Needs or Medical Conditions</Label>
              <Textarea
                id="specialNeeds"
                value={formData.specialNeeds}
                onChange={(e) => updateFormData('specialNeeds', e.target.value)}
                placeholder="Any special care instructions, medications, or medical conditions..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & Preferences</h2>
              <p className="text-gray-600">Set your budget and transport preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget">Maximum Budget *</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', e.target.value)}
                    placeholder="Enter maximum budget"
                    className="pl-8"
                    required
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <p className="text-sm text-gray-500 mt-1">This helps transporters provide accurate quotes</p>
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => updateFormData('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                    <SelectItem value="priority">Priority (2-4 days)</SelectItem>
                    <SelectItem value="urgent">Urgent (Next day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Transport Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                placeholder="Any special requirements for the transport (climate control, frequent stops, etc.)..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Quotes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Flexible dates often result in lower prices</li>
                <li>• Clear special requirements help transporters prepare</li>
                <li>• Accurate weight and size ensure proper vehicle selection</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600">Please review your transport request</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>From:</strong> {formData.originLocation}</div>
                  <div><strong>To:</strong> {formData.destinationLocation}</div>
                  <div><strong>Pickup:</strong> {formData.pickupDate}</div>
                  {formData.deliveryDate && <div><strong>Delivery:</strong> {formData.deliveryDate}</div>}
                  <div><strong>Time:</strong> {formData.timePreference}</div>
                  {formData.flexibleDates && <Badge variant="secondary">Flexible Dates</Badge>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Pet Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {formData.petName}</div>
                  <div><strong>Type:</strong> {formData.petType}</div>
                  <div><strong>Size:</strong> {formData.petSize}</div>
                  {formData.petWeight && <div><strong>Weight:</strong> {formData.petWeight} lbs</div>}
                  {formData.petAge && <div><strong>Age:</strong> {formData.petAge} years</div>}
                </CardContent>
              </Card>
            </div>

            {formData.specialNeeds && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Needs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formData.specialNeeds}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Budget & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Budget:</strong> ${formData.budget}</div>
                <div><strong>Urgency:</strong> {formData.urgency}</div>
                {formData.specialRequirements && (
                  <div><strong>Requirements:</strong> {formData.specialRequirements}</div>
                )}
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Verified transporters will review your request</li>
                <li>• You'll receive competitive bids within 24 hours</li>
                <li>• Compare quotes and choose your preferred transporter</li>
                <li>• Track your pet's journey with real-time updates</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request Pet Transport
            </h1>
            <p className="text-gray-600 mb-6">
              Step {currentStep} of {totalSteps}
            </p>
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>

          {/* Form Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validateStep(currentStep)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function EnhancedRequestQuotePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EnhancedRequestQuotePage />
    </Suspense>
  );
}