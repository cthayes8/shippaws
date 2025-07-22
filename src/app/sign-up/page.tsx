'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Heart, Truck } from 'lucide-react';

export default function SignUpPage() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  useEffect(() => {
    // Get the selected user type from localStorage
    const userType = localStorage.getItem('selectedUserType');
    setSelectedUserType(userType);
  }, []);

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
              Create Your Account
            </h1>
            {selectedUserType && (
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
                <Link 
                  href="/get-started" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change
                </Link>
              </div>
            )}
            <p className="text-gray-600">
              {selectedUserType === 'customer' 
                ? 'Create your account to start finding trusted pet transporters' 
                : selectedUserType === 'transporter'
                ? 'Create your account to start earning as a pet transporter'
                : 'Create your account to get started with pet transportation'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-red-500 hover:bg-red-600',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
              redirectUrl="/onboarding/enhanced"
              signInUrl="/sign-in"
              routing="hash"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-red-500 hover:text-red-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}