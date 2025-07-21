'use client';

import Image from "next/image";
import Link from "next/link";

export default function TransportersPage() {
  return (
    <>
      {/* Navigation */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 bg-white shadow-sm">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/SP - Logo1.png"
              alt="Ship Paws"
              width={120}
              height={60}
              className="object-contain w-20 md:w-[120px]"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#about" className="text-gray-800 hover:text-gray-600 font-medium">
            About
          </Link>
          <Link href="/#how-it-works" className="text-gray-800 hover:text-gray-600 font-medium">
            How It Works
          </Link>
          <Link href="/" className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">
            For Pet Owners
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join the Ship Paws Network
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Connect with pet owners nationwide and build a thriving pet transportation business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/transporters/onboard"
              className="bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-colors font-semibold text-lg"
            >
              Start Application
            </Link>
            <Link 
              href="#benefits"
              className="bg-white text-red-500 border-2 border-red-500 px-8 py-4 rounded-full hover:bg-red-50 transition-colors font-semibold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Why Join Ship Paws?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Transform your pet transportation service into a thriving business with our platform
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Steady Income</h3>
              <p className="text-gray-600">
                Access to a constant stream of customers nationwide. Our transporters average $2,500-$5,000 per month.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
              <p className="text-gray-600">
                Work when you want, where you want. Choose routes that fit your schedule and lifestyle.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Growing Customer Base</h3>
              <p className="text-gray-600">
                Join thousands of pet owners who trust Ship Paws for safe, reliable transportation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Requirements to Join
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Vehicle Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Reliable vehicle with climate control
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Proper ventilation and safety features
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Regular maintenance and inspection
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Secure pet containment systems
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Legal Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Valid driver&apos;s license
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Commercial insurance coverage
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Clean background check
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  USDA certification (where required)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Mike Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Texas • 3 years with Ship Paws</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;Ship Paws has completely transformed my business. I went from struggling to find customers to having a steady stream of bookings. The platform handles everything - I just focus on what I love: caring for pets during transport.&quot;
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-gray-600 text-sm">California • 2 years with Ship Paws</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;The flexibility is incredible. I can choose my routes and schedule around my family time. Last month I earned over $4,000 working just weekends and some weekdays. Highly recommend!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join hundreds of successful transporters already earning with Ship Paws
          </p>
          <Link 
            href="/transporters/onboard"
            className="bg-white text-red-500 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Start Your Application Today
          </Link>
          <p className="text-red-200 mt-4 text-sm">
            Application takes 10-15 minutes • Free to join • No monthly fees
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image
                src="/SP - Logo1.png"
                alt="Ship Paws"
                width={120}
                height={60}
                className="object-contain mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 text-sm">Safe and reliable pet transportation across the country.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Transporters</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/transporters" className="hover:text-white">Why Join Ship Paws</Link></li>
                <li><Link href="/transporters/onboard" className="hover:text-white">Apply Now</Link></li>
                <li><Link href="#" className="hover:text-white">Transporter Resources</Link></li>
                <li><Link href="#" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: transporters@shippaws.com</li>
                <li>Phone: 1-800-SHIP-PAWS</li>
                <li>Mon-Fri 8am-6pm EST</li>
              </ul>
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