'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  originZip: string;
  destinationZip: string;
  pickupDate: string;
}

export default function QuoteRequestForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    originZip: '',
    destinationZip: '',
    pickupDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.originZip || !formData.destinationZip || !formData.pickupDate) {
      alert('Please fill in all fields');
      return;
    }

    // Store form data in localStorage for later use
    localStorage.setItem('heroFormData', JSON.stringify(formData));
    
    // Redirect to get-started page to choose user type
    router.push('/get-started');
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-black p-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center">
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/50 rounded-full transition-colors">
            <input
              type="text"
              placeholder="From ZIP Code"
              value={formData.originZip}
              onChange={(e) => updateFormData('originZip', e.target.value)}
              className="w-full text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:outline-none text-xl"
              required
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/50 rounded-full transition-colors">
            <input
              type="text"
              placeholder="To ZIP Code"
              value={formData.destinationZip}
              onChange={(e) => updateFormData('destinationZip', e.target.value)}
              className="w-full text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:outline-none text-xl"
              required
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-200"></div>
          <div className="flex-1 px-6 py-4 hover:bg-gray-50/50 rounded-full transition-colors">
            <div className="text-gray-500 text-sm mb-1">Pickup Date</div>
            <input
              type="date"
              value={formData.pickupDate}
              onChange={(e) => updateFormData('pickupDate', e.target.value)}
              className="w-full text-gray-600 bg-transparent border-none outline-none focus:outline-none text-xl"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button 
            type="submit"
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-6 px-16 rounded-full font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-1 whitespace-nowrap transform"
            style={{fontFamily: 'Inter, Montserrat, sans-serif'}}
          >
            Get Quotes →
          </button>
        </div>
      </div>
    </form>
  );
}