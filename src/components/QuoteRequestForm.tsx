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

    // Redirect to quote request page with basic form data
    const params = new URLSearchParams();
    params.append('originZip', formData.originZip);
    params.append('destinationZip', formData.destinationZip);
    params.append('pickupDate', formData.pickupDate);
    router.push(`/request-quote?${params.toString()}`);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white/65 backdrop-blur-sm rounded-lg p-4 shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
          Your Pet's Journey Starts Here
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-base md:text-lg font-bold text-gray-900 mb-1">
              From ZIP Code
            </label>
            <input
              type="text"
              placeholder="Origin ZIP"
              value={formData.originZip}
              onChange={(e) => updateFormData('originZip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/5 backdrop-blur-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-base md:text-lg font-bold text-gray-900 mb-1">
              To ZIP Code
            </label>
            <input
              type="text"
              placeholder="Destination ZIP"
              value={formData.destinationZip}
              onChange={(e) => updateFormData('destinationZip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/5 backdrop-blur-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-base md:text-lg font-bold text-gray-900 mb-1">
              Pickup Date
            </label>
            <input
              type="date"
              value={formData.pickupDate}
              onChange={(e) => updateFormData('pickupDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/5 backdrop-blur-sm"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button 
            type="submit"
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold whitespace-nowrap"
          >
            Get Quotes
          </button>
        </div>
      </div>
    </form>
  );
}