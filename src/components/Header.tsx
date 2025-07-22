'use client';

import Image from "next/image";
import { useState } from "react";
import { useAuth, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-2 md:py-3 bg-white/10 backdrop-blur-sm">
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
      <div className="hidden lg:flex items-center gap-8">
        <a href="#about" className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide transition-all duration-200 hover:bg-red-500/20 px-3 py-2 rounded-full" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
          About
        </a>
        <a href="#how-it-works" className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide transition-all duration-200 hover:bg-red-500/20 px-3 py-2 rounded-full" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
          How It Works
        </a>
        <a href="#safety" className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide transition-all duration-200 hover:bg-red-500/20 px-3 py-2 rounded-full" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
          Safety
        </a>
        
        <div className="flex items-center gap-3">
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide transition-all duration-200 px-3 py-2" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
                Login
              </button>
            </SignInButton>
          )}
          
          <Link href="/get-started">
            <button className="bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 hover:shadow-lg transition-all duration-200 font-bold text-2xl uppercase tracking-wide" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
              Get Started
            </button>
          </Link>
        </div>
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
        <div className="lg:hidden bg-white/15 backdrop-blur-lg absolute left-0 right-0 top-full p-6 shadow-xl z-50">
          <div className="flex flex-col space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>About</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>How It Works</a>
            <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>Safety</a>
            
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-red-400 font-bold text-2xl uppercase tracking-wide py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all text-left w-full" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: 'Inter, Montserrat, sans-serif'}}>
                  Login
                </button>
              </SignInButton>
            )}
            
            <div className="pt-2">
              <Link href="/get-started">
                <button onClick={() => setMobileMenuOpen(false)} className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all font-bold text-2xl uppercase tracking-wide w-full" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}