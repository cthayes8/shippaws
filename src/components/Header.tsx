'use client';

import Image from "next/image";
import { useState } from "react";
import { useAuth, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6">
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
        
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
              LOGIN
            </button>
          </SignInButton>
        ) : (
          <Link href="/dashboard" className="text-gray-800 hover:text-gray-600 font-semibold text-base xl:text-lg">
            DASHBOARD
          </Link>
        )}
        
        <Link href="/request-quote">
          <button className="bg-red-500 text-white px-6 py-2 xl:px-8 xl:py-3 rounded-full hover:bg-red-600 transition-colors font-semibold text-base xl:text-lg">
            GET A QUOTE
          </button>
        </Link>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-sm absolute left-0 right-0 top-full p-4 shadow-xl z-50">
          <div className="flex flex-col space-y-4">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">ABOUT</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">HOW IT WORKS</a>
            <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">SAFETY</a>
            <a href="/transporters" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">TRANSPORTERS</a>
            
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2 text-left">
                  LOGIN
                </button>
              </SignInButton>
            ) : (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-lg py-2">
                DASHBOARD
              </Link>
            )}
            
            <Link href="/request-quote">
              <button onClick={() => setMobileMenuOpen(false)} className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors font-semibold text-lg w-full">
                GET A QUOTE
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}