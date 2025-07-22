'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { useAuthStore, UserType } from '@/store/auth-store';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Truck, User, Phone, Building, Car, FileText } from 'lucide-react';

export default function EnhancedOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { setUserProfile, setOnboardingStep, onboardingStep } = useAuthStore();
  
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Transporter-specific fields
  const [companyName, setCompanyName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  
  // Customer-specific fields
  const [petCount, setPetCount] = useState('');
  const [primaryPetType, setPrimaryPetType] = useState('');

  useEffect(() => {
    // Get the selected user type from localStorage
    const userType = localStorage.getItem('selectedUserType') as UserType;
    if (userType) {
      setSelectedUserType(userType);
    }

    // Pre-fill user data from Clerk
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phoneNumbers?.[0]?.phoneNumber || '');
    }
  }, [user]);

  const currentStep = onboardingStep || 1;
  const totalSteps = selectedUserType === 'transporter' ? 3 : 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setOnboardingStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setOnboardingStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedUserType) {
      alert('Missing required information. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create profile in Supabase
      const profileData = {
        id: user.id,
        user_type: selectedUserType === 'customer' ? 'pet_owner' : 'transporter',
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        company_name: selectedUserType === 'transporter' ? companyName : null,
        vehicle_type: selectedUserType === 'transporter' ? vehicleType : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        alert('Error creating profile. Please try again.');
        return;
      }

      // Update Zustand store
      setUserProfile({
        id: user.id,
        userType: selectedUserType,
        firstName,
        lastName,
        email: user.emailAddresses[0]?.emailAddress || '',
        phone,
        companyName: selectedUserType === 'transporter' ? companyName : undefined,
        vehicleType: selectedUserType === 'transporter' ? vehicleType : undefined,
        isOnboarded: true
      });

      // Redirect based on user type and any saved form data
      const heroFormData = localStorage.getItem('heroFormData');
      if (selectedUserType === 'customer' && heroFormData) {
        router.push('/request-quote/enhanced');
      } else if (selectedUserType === 'customer') {
        router.push('/dashboard/enhanced');
      } else {
        router.push('/transporter-dashboard/enhanced');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
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
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with some basic details about you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                type="tel"
              />
            </div>
          </div>
        );

      case 2:
        if (selectedUserType === 'customer') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Pet Information</h2>
                <p className="text-gray-600">Tell us about your pets to get better matches</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="petCount">How many pets do you have?</Label>
                  <Select value={petCount} onValueChange={setPetCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 pet</SelectItem>
                      <SelectItem value="2">2 pets</SelectItem>
                      <SelectItem value="3">3 pets</SelectItem>
                      <SelectItem value="4+">4 or more pets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="primaryPetType">Primary pet type</Label>
                  <Select value={primaryPetType} onValueChange={setPrimaryPetType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Don't worry, you can add detailed pet profiles later in your dashboard.
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Business Information</h2>
                <p className="text-gray-600">Tell us about your transportation business</p>
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company or business name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleType">Primary Vehicle Type *</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="trailer">Trailer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g., Ford Transit"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 3:
        if (selectedUserType === 'transporter') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Professional Details</h2>
                <p className="text-gray-600">Help customers understand your experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Select value={yearsExperience} onValueChange={setYearsExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="e.g., State Farm, Progressive"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Next Steps</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Complete verification process</li>
                  <li>• Upload insurance documents</li>
                  <li>• Set your service areas</li>
                  <li>• Start receiving job requests</li>
                </ul>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Select Account Type</h1>
            <p className="text-gray-600 mb-6">Please select your account type first</p>
            <Button onClick={() => router.push('/get-started')}>
              Choose Account Type
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="px-3 py-1">
                {selectedUserType === 'customer' ? (
                  <>
                    <Heart className="w-4 h-4 mr-1" />
                    Pet Owner
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-1" />
                    Transporter
                  </>
                )}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mb-6">
              Step {currentStep} of {totalSteps}
            </p>
            
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !firstName || !lastName}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Complete Setup'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    disabled={!firstName || !lastName}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next
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