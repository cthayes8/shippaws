'use client';

import Image from "next/image";
import Header from "@/components/Header";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        {/* Video Background - Desktop Only */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/Copy of SP video 12 (3).mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10"></div>
        
        {/* Mobile Background Pattern */}
        <div className="md:hidden absolute inset-0 opacity-10 z-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-20">
          {/* Navigation */}
          <Header />

          {/* Hero Section - Shorter like Hirezy */}
          <div className="relative flex flex-col justify-center min-h-[60vh] px-4 md:px-8">
            {/* Main Headline - Left positioned */}
            <div className="text-left max-w-3xl mb-16">
              <div className="text-panel space-y-4">
                <h1 className="text-white leading-none drop-shadow-lg font-inter">
                  <span className="block text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.9)', fontFamily: 'Inter, Montserrat, sans-serif'}}>Ship Your Pet Safely</span>
                  <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-red-400/80 tracking-tight" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>Coast to Coast</span>
                </h1>
                <p className="text-white text-3xl md:text-4xl mt-4 max-w-2xl font-bold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
                  Professional transporters you can trust
                </p>
              </div>
            </div>
            
            {/* Quote Bar inside Hero - Centered and Lower */}
            <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
              <QuoteRequestForm />
            </div>
          </div>
        </div>
      </div>


      {/* Combined Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-red-100">
              <div className="text-3xl md:text-4xl font-black text-red-600 mb-2" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>500+</div>
              <div className="text-sm font-medium text-gray-700">Verified Transporters</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-blue-100">
              <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>10k+</div>
              <div className="text-sm font-medium text-gray-700">Happy Pets</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-green-100">
              <div className="text-3xl md:text-4xl font-black text-green-600 mb-2" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>4.9★</div>
              <div className="text-sm font-medium text-gray-700">Average Rating</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-purple-100">
              <div className="text-3xl md:text-4xl font-black text-purple-600 mb-2" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>24/7</div>
              <div className="text-sm font-medium text-gray-700">Support</div>
            </div>
          </div>

          {/* Main Value Proposition */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
                Your Pet's Journey, 
                <span className="text-red-500"> Our Priority</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ship Paws connects loving pet owners with verified, professional transporters across the country. 
                Whether you're relocating or bringing home a new family member, we make pet transportation safe, 
                transparent, and stress-free.
              </p>
              
              {/* Key Benefits */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Verified & Insured Transporters</h4>
                    <p className="text-gray-600">Every transporter is thoroughly vetted, licensed, and insured.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Transparent Pricing</h4>
                    <p className="text-gray-600">Compare quotes and choose the best value for your pet's journey.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">24/7 Support & Tracking</h4>
                    <p className="text-gray-600">Real-time updates and round-the-clock support for peace of mind.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Placeholder for future image */}
            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-3xl p-12 text-center border border-red-100">
              <div className="text-6xl mb-4">🐕‍🦺</div>
              <p className="text-gray-600 font-medium">Professional pet transportation you can trust</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Safety Section */}
      <section id="safety" className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">Your Pet&apos;s Safety is Our Priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 md:w-6 h-5 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Verified Transporters</h3>
                    <p className="text-gray-600 text-sm md:text-base">All transporters are thoroughly vetted, licensed, and insured for your peace of mind.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 md:w-6 h-5 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Climate-Controlled Vehicles</h3>
                    <p className="text-gray-600 text-sm md:text-base">Temperature-regulated transport ensures your pet&apos;s comfort throughout the journey.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 md:w-6 h-5 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-600 text-sm md:text-base">Our dedicated support team is available around the clock to assist you and ensure a smooth journey.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-4">Safety Standards</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm md:text-base">
                  <span className="text-blue-600 mr-2">✓</span>
                  USDA certified transporters
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <span className="text-blue-600 mr-2">✓</span>
                  Regular vehicle inspections
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <span className="text-blue-600 mr-2">✓</span>
                  GPS tracking on all trips
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <span className="text-blue-600 mr-2">✓</span>
                  Comprehensive insurance coverage
                </li>
                <li className="flex items-center text-sm md:text-base">
                  <span className="text-blue-600 mr-2">✓</span>
                  Regular comfort breaks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center md:text-left">
              <Image
                src="/SP - Logo1.png"
                alt="Ship Paws"
                width={120}
                height={60}
                className="object-contain mb-4 brightness-0 invert mx-auto md:mx-0"
              />
              <p className="text-gray-400 text-sm">Safe and reliable pet transportation across the country.</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#safety" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4">For Transporters</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/transporters" className="hover:text-white">Become a Transporter</a></li>
                <li><a href="/transporter-login" className="hover:text-white">Transporter Login</a></li>
                <li><a href="/dashboard/enhanced" className="hover:text-white">Transporter Dashboard</a></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Ship Paws. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}