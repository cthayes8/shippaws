'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StepIndicator from './components/StepIndicator';
import BusinessInfo from './components/BusinessInfo';
import VehicleInfo from './components/VehicleInfo';
import DocumentUpload from './components/DocumentUpload';
import ReviewSubmit from './components/ReviewSubmit';

const STEPS = [
  'Personal & Business Info',
  'Vehicle Information', 
  'Documents & Credentials',
  'Review & Submit'
];

interface FormData {
  // Personal/Business Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  serviceAreas: string;
  experienceYears: string;
  
  // Vehicle Info
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  climateControl: boolean;
  maxPetCapacity: string;
  specialAccommodations: string;
  
  // Documents
  driversLicense: File | null;
  insurance: File | null;
  usdaCertification: File | null;
  vehicleInspection: File | null;
  backgroundCheckConsent: boolean;
  
  // Terms
  termsAccepted: boolean;
}

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceAreas: '',
    experienceYears: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    climateControl: false,
    maxPetCapacity: '',
    specialAccommodations: '',
    driversLicense: null,
    insurance: null,
    usdaCertification: null,
    vehicleInspection: null,
    backgroundCheckConsent: false,
    termsAccepted: false,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('shippaws-onboard-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Don't restore files from localStorage, only form fields
        const { driversLicense, insurance, usdaCertification, vehicleInspection, ...textData } = parsed;
        setFormData(prev => ({ ...prev, ...textData }));
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes (except files)
  useEffect(() => {
    const { driversLicense, insurance, usdaCertification, vehicleInspection, ...dataToSave } = formData;
    localStorage.setItem('shippaws-onboard-data', JSON.stringify(dataToSave));
  }, [formData]);

  const updateFormData = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would submit the form data to your backend
    console.log('Submitting application:', formData);
    
    // Clear saved data after successful submission
    localStorage.removeItem('shippaws-onboard-data');
    
    // Show success message and redirect
    alert(`Application submitted successfully!\n\nThank you ${formData.firstName}, we'll review your application and get back to you within 2-3 business days.\n\nYou'll receive a confirmation email at ${formData.email} shortly.`);
    
    // Redirect to success page or back to transporters page
    window.location.href = '/transporters';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <VehicleInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <DocumentUpload
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/transporters">
            <Image
              src="/SP - Logo1.png"
              alt="Ship Paws"
              width={120}
              height={60}
              className="object-contain"
            />
          </Link>
          <div className="text-sm text-gray-600">
            Need help? Call <a href="tel:1-800-SHIP-PAWS" className="text-red-500 hover:text-red-600">1-800-SHIP-PAWS</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Join Ship Paws Network
            </h1>
            <p className="text-gray-600">
              Complete your application to start transporting pets and earning with Ship Paws
            </p>
          </div>

          {/* Step Indicator */}
          <div className="px-6 py-4 bg-white border-b">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={STEPS.length}
              steps={STEPS}
            />
          </div>

          {/* Form Content */}
          <div className="p-6">
            {renderStep()}
          </div>
        </div>

        {/* Auto-save Notice */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Your progress is automatically saved. You can return anytime to complete your application.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-2">
            Questions about the application process?
          </p>
          <p className="text-sm">
            Email us at{' '}
            <a href="mailto:transporters@shippaws.com" className="text-red-400 hover:text-red-300">
              transporters@shippaws.com
            </a>{' '}
            or call{' '}
            <a href="tel:1-800-SHIP-PAWS" className="text-red-400 hover:text-red-300">
              1-800-SHIP-PAWS
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}