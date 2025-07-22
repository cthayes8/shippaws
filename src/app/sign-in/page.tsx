'use client';

import { SignIn } from '@clerk/nextjs';
import Header from '@/components/Header';

export default function SignInPage() {
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
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your Ship Paws account
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-red-500 hover:bg-red-600',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
              afterSignInUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-red-500 hover:text-red-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}