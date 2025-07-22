'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [userType, setUserType] = useState<'pet_owner' | 'transporter' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phoneNumbers?.[0]?.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType || !firstName || !lastName) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      alert('User not authenticated. Please sign in again.');
      return;
    }

    console.log('Creating profile for user:', user.id, 'with type:', userType);
    setIsSubmitting(true);

    try {
      // Create profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          user_type: userType,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null
        })
        .select()
        .single();

      if (error) {
        console.error('Profile creation error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // If transporter, create transporter profile
      if (userType === 'transporter') {
        const { data: transporterData, error: transporterError } = await supabase
          .from('transporter_profiles')
          .insert({
            id: user.id,
            is_approved: false
          })
          .select()
          .single();

        if (transporterError) {
          console.error('Transporter profile creation error details:', {
            message: transporterError.message,
            details: transporterError.details,
            hint: transporterError.hint,
            code: transporterError.code
          });
          throw transporterError;
        }
        
        // Redirect to transporter onboarding
        router.push('/transporters/onboard');
      } else {
        // Pet owners go to pet onboarding
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        if (redirectUrl) {
          router.push(`/onboarding/pets?redirect=${encodeURIComponent(redirectUrl)}`);
        } else {
          // Check if there's a pending quote request
          const pendingRequest = localStorage.getItem('pending-quote-request');
          if (pendingRequest) {
            router.push('/onboarding/pets?redirect=' + encodeURIComponent('/request-quote'));
          } else {
            router.push('/onboarding/pets');
          }
        }
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      
      let errorMessage = 'Error creating your profile. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('duplicate key')) {
          errorMessage = 'An account with this information already exists. Please try signing in instead.';
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = 'Authentication error. Please sign out and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us a bit about yourself to get started
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to... *
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="pet_owner"
                      checked={userType === 'pet_owner'}
                      onChange={(e) => setUserType(e.target.value as 'pet_owner')}
                      className="mt-1 mr-3 text-red-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Transport my pet</div>
                      <div className="text-sm text-gray-600">I need to find reliable transportation for my pet</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="transporter"
                      checked={userType === 'transporter'}
                      onChange={(e) => setUserType(e.target.value as 'transporter')}
                      className="mt-1 mr-3 text-red-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Become a transporter</div>
                      <div className="text-sm text-gray-600">I want to provide pet transportation services</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Setting up your account...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}