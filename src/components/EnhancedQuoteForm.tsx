'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LocationInput from './LocationInput';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';

interface FormData {
  originLocation: string;
  destinationLocation: string;
  pickupDate: string;
}

export default function EnhancedQuoteForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    originLocation: '',
    destinationLocation: '',
    pickupDate: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Validate first step
      if (!formData.originLocation || !formData.destinationLocation) {
        alert('Please enter both pickup and destination locations');
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Final submission
    if (!formData.pickupDate) {
      alert('Please select a pickup date');
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Where is your pet traveling?
            </h2>
            <p className="text-gray-600 text-lg">
              Get quotes from verified transporters in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationInput
              label="From"
              placeholder="City, State or ZIP"
              value={formData.originLocation}
              onChange={(value) => updateFormData('originLocation', value)}
              required
            />
            <LocationInput
              label="To"
              placeholder="City, State or ZIP"
              value={formData.destinationLocation}
              onChange={(value) => updateFormData('destinationLocation', value)}
              required
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 font-medium">
              {formData.originLocation} → {formData.destinationLocation}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            When do you need pickup?
          </h2>
          <p className="text-gray-600">
            Choose your preferred pickup date
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="relative">
            <label className="block text-base md:text-lg font-bold text-gray-900 mb-2">
              Pickup Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => updateFormData('pickupDate', e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/95 backdrop-blur-sm text-gray-900"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button 
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            Get Quotes
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card className="bg-white border-gray-200 shadow-2xl">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <div className={`w-8 h-1 rounded transition-colors ${
                currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
            </div>
          </div>

          {renderStepContent()}

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Verified Transporters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Insured & Licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>24/7 Support</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}