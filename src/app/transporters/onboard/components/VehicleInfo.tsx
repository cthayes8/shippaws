interface VehicleInfoProps {
  formData: {
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    climateControl: boolean;
    maxPetCapacity: string;
    specialAccommodations: string;
  };
  updateFormData: (field: string, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function VehicleInfo({ formData, updateFormData, onNext, onBack }: VehicleInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.vehicleType || !formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear || !formData.maxPetCapacity) {
      alert('Please fill in all required fields');
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Vehicle Information</h3>
        <p className="text-blue-700 text-sm">
          Tell us about the vehicle you&apos;ll use for pet transportation. This ensures safety and comfort for all pets.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Type *
        </label>
        <select
          value={formData.vehicleType}
          onChange={(e) => updateFormData('vehicleType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          required
        >
          <option value="">Select vehicle type</option>
          <option value="car">Car</option>
          <option value="suv">SUV</option>
          <option value="van">Van</option>
          <option value="truck">Pickup Truck</option>
          <option value="trailer">Trailer</option>
          <option value="motorhome">Motor Home/RV</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make *
          </label>
          <input
            type="text"
            value={formData.vehicleMake}
            onChange={(e) => updateFormData('vehicleMake', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            placeholder="e.g., Ford, Toyota, Chevrolet"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model *
          </label>
          <input
            type="text"
            value={formData.vehicleModel}
            onChange={(e) => updateFormData('vehicleModel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            placeholder="e.g., F-150, Camry, Silverado"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year *
        </label>
        <select
          value={formData.vehicleYear}
          onChange={(e) => updateFormData('vehicleYear', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          required
        >
          <option value="">Select year</option>
          {Array.from({ length: 15 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="climateControl"
          checked={formData.climateControl}
          onChange={(e) => updateFormData('climateControl', e.target.checked)}
          className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
        />
        <label htmlFor="climateControl" className="text-sm font-medium text-gray-700">
          Vehicle has climate control (air conditioning/heating)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Pet Capacity *
        </label>
        <select
          value={formData.maxPetCapacity}
          onChange={(e) => updateFormData('maxPetCapacity', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          required
        >
          <option value="">Select capacity</option>
          <option value="1">1 pet</option>
          <option value="2">2 pets</option>
          <option value="3">3 pets</option>
          <option value="4">4 pets</option>
          <option value="5">5 pets</option>
          <option value="6+">6+ pets</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Accommodations & Equipment
        </label>
        <textarea
          value={formData.specialAccommodations}
          onChange={(e) => updateFormData('specialAccommodations', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          placeholder="Describe any special equipment, safety features, or accommodations your vehicle has (e.g., pet barriers, temperature monitoring, backup camera, etc.)"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-medium text-yellow-900">Important</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Your vehicle will need to pass a safety inspection before you can start accepting bookings.
            </p>
          </div>
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
          className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Continue
        </button>
      </div>
    </form>
  );
}