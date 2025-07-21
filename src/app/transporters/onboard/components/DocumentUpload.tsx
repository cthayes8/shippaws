interface DocumentUploadProps {
  formData: {
    driversLicense: File | null;
    insurance: File | null;
    usdaCertification: File | null;
    vehicleInspection: File | null;
    backgroundCheckConsent: boolean;
  };
  updateFormData: (field: string, value: File | null | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentUpload({ formData, updateFormData, onNext, onBack }: DocumentUploadProps) {
  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateFormData(field, file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.driversLicense || !formData.insurance || !formData.backgroundCheckConsent) {
      alert('Please upload required documents and provide consent for background check');
      return;
    }
    
    onNext();
  };

  const FileUploadField = ({ 
    label, 
    field, 
    required = false, 
    description 
  }: { 
    label: string; 
    field: keyof typeof formData; 
    required?: boolean; 
    description?: string;
  }) => {
    const file = formData[field] as File | null;
    
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="text-gray-500 text-sm mb-3">{description}</p>
        )}
        
        <div className="flex items-center justify-center w-full">
          <label className={`
            flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
            ${file 
              ? 'border-green-300 bg-green-50 hover:bg-green-100' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }
          `}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <>
                  <svg className="w-8 h-8 mb-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-700 font-medium">{file.name}</p>
                  <p className="text-xs text-green-600">Click to change file</p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 10MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload(field as string)}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Documents & Credentials</h3>
        <p className="text-blue-700 text-sm">
          Upload the required documents to verify your credentials and ensure compliance with regulations.
        </p>
      </div>

      <FileUploadField
        label="Driver's License"
        field="driversLicense"
        required
        description="Upload a clear photo of your valid driver's license (front and back if needed)"
      />

      <FileUploadField
        label="Commercial Insurance Certificate"
        field="insurance"
        required
        description="Proof of commercial vehicle insurance with minimum $100,000 coverage"
      />

      <FileUploadField
        label="USDA Certification"
        field="usdaCertification"
        description="Required for interstate pet transportation (if applicable to your service area)"
      />

      <FileUploadField
        label="Vehicle Inspection Certificate"
        field="vehicleInspection"
        description="Recent vehicle safety inspection certificate"
      />

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Background Check Consent</h4>
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="backgroundConsent"
            checked={formData.backgroundCheckConsent}
            onChange={(e) => updateFormData('backgroundCheckConsent', e.target.checked)}
            className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500 mt-0.5"
            required
          />
          <label htmlFor="backgroundConsent" className="text-sm text-yellow-800">
            I consent to Ship Paws conducting a background check as part of the application process. 
            This includes criminal history, driving record, and identity verification. *
          </label>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Document Guidelines</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• All documents must be current and valid</li>
          <li>• Images should be clear and readable</li>
          <li>• Accepted formats: PDF, JPG, PNG (max 10MB each)</li>
          <li>• Processing typically takes 2-3 business days</li>
        </ul>
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
          className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Continue
        </button>
      </div>
    </form>
  );
}