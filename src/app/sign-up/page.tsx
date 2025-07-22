'use client';

import { SignUp } from '@clerk/nextjs';
import Header from '@/components/Header';

export default function SignUpPage() {
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
              Join Ship Paws
            </h1>
            <p className="text-gray-600">
              Create your account to get started with pet transportation
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
              redirectUrl="/onboarding"
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