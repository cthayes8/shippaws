'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserType } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { Users, Truck, Heart, Star, Shield, Clock } from 'lucide-react';

interface UserRoleOption {
  type: UserType;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  badge?: string;
}

const roleOptions: UserRoleOption[] = [
  {
    type: 'customer',
    icon: <Heart className="w-8 h-8" />,
    title: 'Pet Owner',
    description: 'Find trusted transporters for your beloved pets',
    benefits: [
      'Compare quotes from verified transporters',
      'Real-time tracking and updates',
      'Secure payment protection',
      'Insurance coverage included',
      'Direct communication with transporters'
    ],
    badge: 'Most Popular'
  },
  {
    type: 'transporter',
    icon: <Truck className="w-8 h-8" />,
    title: 'Pet Transporter',
    description: 'Start earning by helping pets reach their destinations safely',
    benefits: [
      'Set your own rates and schedule',
      'Access to verified pet owners',
      'Secure payment system',
      'Build your reputation with reviews',
      'Comprehensive insurance support'
    ]
  }
];

export default function GetStartedPage() {
  const router = useRouter();
  const { setOnboardingStep } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);

  const handleRoleSelect = (roleType: UserType) => {
    setSelectedRole(roleType);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setOnboardingStep(1);
      // Store the selected role in localStorage for the onboarding flow
      localStorage.setItem('selectedUserType', selectedRole);
      router.push('/sign-up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Ship Paws
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose how you'd like to be part of our trusted pet transportation marketplace
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Verified Transporters</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roleOptions.map((role) => (
              <Card 
                key={role.type}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.type 
                    ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleRoleSelect(role.type)}
              >
                {role.badge && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    {role.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-3 rounded-full ${
                    selectedRole === role.type 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {role.icon}
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {role.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button 
              onClick={handleContinue}
              disabled={!selectedRole}
              size="lg"
              className="px-12 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue as {selectedRole === 'customer' ? 'Pet Owner' : selectedRole === 'transporter' ? 'Transporter' : '...'}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              You can always change your account type later in your profile settings
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600 text-sm">
                Join thousands of pet owners and professional transporters
              </p>
            </div>
            <div>
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">
                All transporters are verified and fully insured
              </p>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="font-semibold mb-2">Highly Rated</h3>
              <p className="text-gray-600 text-sm">
                4.9/5 average rating from satisfied customers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}