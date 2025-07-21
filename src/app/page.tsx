'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetQuote = () => {
    // Basic validation
    if (!pickupLocation || !deliveryLocation || !pickupDate || !deliveryDate) {
      alert('Please fill in all fields to get a quote.');
      return;
    }
    
    // Handle quote request - could integrate with a quote system or redirect to a quote page
    console.log({ pickupLocation, deliveryLocation, pickupDate, deliveryDate });
    
    // For now, show a success message
    alert(`Quote request submitted!\n\nPickup: ${pickupLocation}\nDelivery: ${deliveryLocation}\nPickup Date: ${pickupDate}\nDelivery Date: ${deliveryDate}\n\nWe'll contact you shortly with quotes from verified transporters.`);
  };

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
          <source src="/SP video 12.mp4" type="video/mp4" />
        </video>
        
        {/* Mobile Background Pattern */}
        <div className="md:hidden absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-20">
          {/* Navigation */}
          <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center">
              <Image
                src="/SP - Logo1.png"
                alt="Ship Paws"
                width={120}
                height={60}
                className="object-contain w-20 md:w-[120px]"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a href="#about" className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
                ABOUT
              </a>
              <a href="#how-it-works" className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
                HOW IT WORKS
              </a>
              <a href="#safety" className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
                SAFETY
              </a>
              <a href="/transporters" className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
                TRANSPORTERS
              </a>
              <button className="bg-red-500 text-white px-6 py-2 xl:px-8 xl:py-3 rounded-full hover:bg-red-600 transition-colors font-semibold text-base xl:text-lg">
                GET A QUOTE
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-sm absolute left-0 right-0 p-4 shadow-xl z-50">
              <div className="flex flex-col space-y-4">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">ABOUT</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">HOW IT WORKS</a>
                <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">SAFETY</a>
                <a href="/transporters" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">TRANSPORTERS</a>
                <button onClick={() => setMobileMenuOpen(false)} className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors font-semibold text-lg w-full">
                  GET A QUOTE
                </button>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-end min-h-[calc(100vh-120px)] px-4 md:px-8 pb-16 md:pb-32">
            {/* Quote Form - Desktop */}
            <div className="hidden md:block bg-white rounded-full shadow-2xl w-full max-w-7xl">
              <div className="flex items-center">
                <div className="flex-1 px-4 lg:px-8 py-4 lg:py-6 border-r border-gray-200">
                  <label className="block text-sm lg:text-base font-bold text-gray-900 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    placeholder="Enter city or address"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="flex-1 px-4 lg:px-8 py-4 lg:py-6 border-r border-gray-200">
                  <label className="block text-sm lg:text-base font-bold text-gray-900 mb-1">Delivery Location</label>
                  <input
                    type="text"
                    placeholder="Enter city or address"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="flex-1 px-4 lg:px-8 py-4 lg:py-6 border-r border-gray-200">
                  <label className="block text-sm lg:text-base font-bold text-gray-900 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="flex-1 px-4 lg:px-8 py-4 lg:py-6">
                  <label className="block text-sm lg:text-base font-bold text-gray-900 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm lg:text-base"
                  />
                </div>
                <div className="pr-6">
                  <button
                    onClick={handleGetQuote}
                    className="bg-red-500 text-white p-4 lg:p-5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 lg:w-7 lg:h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quote Form - Mobile */}
            <div className="md:hidden bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-center mb-2">
                <Image
                  src="/SP - LOGO 2.png"
                  alt="Ship Paws"
                  width={150}
                  height={75}
                  className="object-contain"
                />
              </div>
              <p className="text-red-500 font-bold text-lg mb-6 text-center">Trusted Pet Transportation Nationwide</p>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Get a Quote</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    placeholder="Enter city or address"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Delivery Location</label>
                  <input
                    type="text"
                    placeholder="Enter city or address"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  onClick={handleGetQuote}
                  className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors font-semibold text-lg"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800">Connecting Pets with Trusted Transportation</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Ship Paws is the premier marketplace for pet transportation, connecting pet owners with verified, professional pet transporters across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-16">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Verified Transporters</h3>
              <p className="text-gray-600">Every transporter is thoroughly vetted, licensed, and insured to ensure your pet&apos;s safety.</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">Compare quotes from multiple transporters to find the best value for your pet&apos;s journey.</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Peace of Mind</h3>
              <p className="text-gray-600">Real-time tracking and regular updates throughout your pet&apos;s journey.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Why Choose Ship Paws?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re relocating, bringing home a new pet, or need specialized transport services, 
              Ship Paws makes it easy to find reliable, caring professionals who will treat your pet like family. 
              Our platform ensures a stress-free experience for both you and your beloved companion.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white text-xl md:text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Get Quotes</h3>
              <p className="text-gray-600">Enter your origin, destination, and desired dates to receive instant quotes from verified pet transporters.</p>
            </div>
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white text-xl md:text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Choose Your Transporter</h3>
              <p className="text-gray-600">Compare quotes, read reviews, and select the transporter that best fits your needs and budget.</p>
            </div>
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white text-xl md:text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Track Your Pet</h3>
              <p className="text-gray-600">Stay updated with real-time tracking and regular updates throughout your pet&apos;s journey.</p>
            </div>
          </div>
        </div>
      </section>

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
      <section id="testimonials" className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 md:w-5 h-4 md:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">&quot;Ship Paws made moving my dog across the country stress-free. The transporter was professional and sent updates throughout the journey. Highly recommend!&quot;</p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-xs md:text-sm text-gray-500">Los Angeles to New York</div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 md:w-5 h-4 md:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">&quot;Excellent service! My cats arrived happy and healthy. The ability to track their journey in real-time gave me peace of mind. Will use again!&quot;</p>
              <div className="font-semibold">Michael R.</div>
              <div className="text-xs md:text-sm text-gray-500">Chicago to Miami</div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 md:w-5 h-4 md:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">&quot;The quote process was simple and transparent. Our transporter was caring and experienced. Our puppy had a comfortable journey. Thank you Ship Paws!&quot;</p>
              <div className="font-semibold">Emily T.</div>
              <div className="text-xs md:text-sm text-gray-500">Seattle to Denver</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                <li><a href="/transporters" className="hover:text-white">For Transporters</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
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