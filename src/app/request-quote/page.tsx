'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

interface FormData {
  originZip: string;
  destinationZip: string;
  petType: string;
  petSize: string;
  preferredDate: string;
  petName: string;
  specialInstructions: string;
}

function RequestQuotePage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<FormData>({
    originZip: '',
    destinationZip: '',
    petType: '',
    petSize: '',
    preferredDate: '',
    petName: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is not signed in, redirect to sign-up with current URL as redirect
    if (user === null) {
      const currentParams = new URLSearchParams(window.location.search);
      router.push(`/sign-up?redirect=${encodeURIComponent(`/request-quote?${currentParams.toString()}`)}`);
      return;
    }

    // Check for form data from URL params (from homepage form)
    const urlParams = {
      originZip: searchParams.get('originZip') || '',
      destinationZip: searchParams.get('destinationZip') || '',
      petType: searchParams.get('petType') || '',
      petSize: searchParams.get('petSize') || '',
      preferredDate: searchParams.get('pickupDate') || searchParams.get('preferredDate') || '',
      petName: searchParams.get('petName') || '',
      specialInstructions: searchParams.get('specialInstructions') || ''
    };

    // Check for saved data from localStorage (from sign-up redirect)
    const savedData = localStorage.getItem('pending-quote-request');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
        localStorage.removeItem('pending-quote-request');
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    } else if (Object.values(urlParams).some(val => val)) {
      setFormData(prev => ({ ...prev, ...urlParams }));
    }
  }, [searchParams, router, user]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.originZip || !formData.destinationZip || !formData.petType || !formData.petSize || !formData.preferredDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      alert('You must be logged in to submit a quote request');
      router.push('/sign-in');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting transport request for user:', user.id);
      
      // First, check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_type')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('User profile not found:', profileError);
        alert('Please complete your account setup first by visiting your profile.');
        router.push('/onboarding');
        return;
      }

      if (profile.user_type !== 'pet_owner') {
        alert('Only pet owners can submit transport requests.');
        router.push('/dashboard');
        return;
      }
      
      const { data, error } = await supabase
        .from('transport_requests')
        .insert({
          user_id: user.id,
          origin_zip: formData.originZip,
          destination_zip: formData.destinationZip,
          pet_type: formData.petType,
          pet_size: formData.petSize,
          pet_name: formData.petName || null,
          preferred_date: formData.preferredDate,
          special_instructions: formData.specialInstructions || null,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Transport request submission error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Transport request created successfully:', data);
      // Redirect to dashboard with success message
      router.push(`/dashboard?success=quote-submitted&id=${data.id}`);
    } catch (error: any) {
      console.error('Error submitting quote request:', error);
      
      let errorMessage = 'Error submitting your quote request. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = 'Permission error. Please make sure you are signed in and try again.';
        } else if (error.message.includes('foreign key')) {
          errorMessage = 'Account setup incomplete. Please complete your profile setup.';
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
      <main className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request Pet Transport Quote
          </h1>
          <p className="text-gray-600">
            Tell us about your pet&apos;s journey and we&apos;ll connect you with verified transporters
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From ZIP Code *
                </label>
                <input
                  type="text"
                  placeholder="Origin ZIP"
                  value={formData.originZip}
                  onChange={(e) => updateFormData('originZip', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To ZIP Code *
                </label>
                <input
                  type="text"
                  placeholder="Destination ZIP"
                  value={formData.destinationZip}
                  onChange={(e) => updateFormData('destinationZip', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Type *
                </label>
                <select
                  value={formData.petType}
                  onChange={(e) => updateFormData('petType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select Pet Type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Size *
                </label>
                <select
                  value={formData.petSize}
                  onChange={(e) => updateFormData('petSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="">Select Pet Size</option>
                  <option value="small">Small (under 25 lbs)</option>
                  <option value="medium">Medium (25-60 lbs)</option>
                  <option value="large">Large (60-100 lbs)</option>
                  <option value="extra-large">Extra Large (over 100 lbs)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => updateFormData('preferredDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name
                </label>
                <input
                  type="text"
                  placeholder="Your pet's name"
                  value={formData.petName}
                  onChange={(e) => updateFormData('petName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                placeholder="Any special needs or instructions for your pet's transport..."
                value={formData.specialInstructions}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Verified transporters will review your request</li>
                <li>• You&apos;ll receive competitive bids within 24 hours</li>
                <li>• Compare quotes and choose your preferred transporter</li>
                <li>• Book securely and track your pet&apos;s journey</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Quote Request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function RequestQuotePageWithSuspense() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <RequestQuotePage />
    </Suspense>
  );
}