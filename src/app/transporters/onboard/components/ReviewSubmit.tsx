interface ReviewSubmitProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    serviceAreas: string;
    experienceYears: string;
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    climateControl: boolean;
    maxPetCapacity: string;
    specialAccommodations: string;
    driversLicense: File | null;
    insurance: File | null;
    usdaCertification: File | null;
    vehicleInspection: File | null;
    backgroundCheckConsent: boolean;
    termsAccepted: boolean;
  };
  updateFormData: (field: string, value: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ReviewSubmit({ formData, updateFormData, onSubmit, onBack }: ReviewSubmitProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    
    onSubmit();
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | boolean }) => (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-900">
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'Not provided'}
      </span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Review Your Application</h3>
        <p className="text-blue-700 text-sm">
          Please review all information before submitting. You can go back to make changes if needed.
        </p>
      </div>

      <InfoSection title="Personal Information">
        <InfoRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
        <InfoRow label="Email" value={formData.email} />
        <InfoRow label="Phone" value={formData.phone} />
        <InfoRow label="Business Name" value={formData.businessName} />
        <InfoRow label="Experience" value={formData.experienceYears} />
      </InfoSection>

      <InfoSection title="Service Information">
        <div className="py-2">
          <span className="text-gray-600">Service Areas:</span>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
            {formData.serviceAreas || 'Not specified'}
          </div>
        </div>
      </InfoSection>

      <InfoSection title="Vehicle Information">
        <InfoRow label="Type" value={formData.vehicleType} />
        <InfoRow label="Make & Model" value={`${formData.vehicleMake} ${formData.vehicleModel}`} />
        <InfoRow label="Year" value={formData.vehicleYear} />
        <InfoRow label="Climate Control" value={formData.climateControl} />
        <InfoRow label="Max Pet Capacity" value={formData.maxPetCapacity} />
        {formData.specialAccommodations && (
          <div className="py-2">
            <span className="text-gray-600">Special Accommodations:</span>
            <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
              {formData.specialAccommodations}
            </div>
          </div>
        )}
      </InfoSection>

      <InfoSection title="Documents Uploaded">
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Driver&apos;s License:</span>
            <span className={`font-medium ${formData.driversLicense ? 'text-green-600' : 'text-red-600'}`}>
              {formData.driversLicense ? '✓ Uploaded' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Insurance Certificate:</span>
            <span className={`font-medium ${formData.insurance ? 'text-green-600' : 'text-red-600'}`}>
              {formData.insurance ? '✓ Uploaded' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">USDA Certification:</span>
            <span className={`font-medium ${formData.usdaCertification ? 'text-green-600' : 'text-gray-500'}`}>
              {formData.usdaCertification ? '✓ Uploaded' : 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Vehicle Inspection:</span>
            <span className={`font-medium ${formData.vehicleInspection ? 'text-green-600' : 'text-gray-500'}`}>
              {formData.vehicleInspection ? '✓ Uploaded' : 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Background Check Consent:</span>
            <span className={`font-medium ${formData.backgroundCheckConsent ? 'text-green-600' : 'text-red-600'}`}>
              {formData.backgroundCheckConsent ? '✓ Provided' : '✗ Required'}
            </span>
          </div>
        </div>
      </InfoSection>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-3">What Happens Next?</h4>
        <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
          <li>Your application will be reviewed within 2-3 business days</li>
          <li>We&apos;ll verify your documents and conduct the background check</li>
          <li>If approved, you&apos;ll receive onboarding materials and platform access</li>
          <li>Complete a brief vehicle inspection (may be virtual)</li>
          <li>Start accepting bookings and earning with Ship Paws!</li>
        </ol>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500 mt-0.5"
            required
          />
          <label htmlFor="termsAccepted" className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <a href="#" className="text-red-500 hover:text-red-600 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-red-500 hover:text-red-600 underline">
              Privacy Policy
            </a>
            . I understand that Ship Paws will review my application and may request additional information. *
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}