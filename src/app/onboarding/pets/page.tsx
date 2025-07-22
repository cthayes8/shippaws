'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import type { Pet } from '@/lib/supabase';
import Header from '@/components/Header';

interface PetFormData {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'ferret' | 'reptile' | 'other' | '';
  ageYears: string;
  ageMonths: string;
  weight: string;
  weightUnit: 'lbs' | 'kg';
  specialNeeds: string;
}

export default function PetOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [pets, setPets] = useState<PetFormData[]>([
    {
      name: '',
      species: '',
      ageYears: '',
      ageMonths: '',
      weight: '',
      weightUnit: 'lbs',
      specialNeeds: ''
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Verify user is pet owner
    if (user?.id) {
      verifyPetOwner();
    }
  }, [user]);

  const verifyPetOwner = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (error || profile?.user_type !== 'pet_owner') {
        // Redirect non-pet owners
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error verifying user type:', error);
      router.push('/dashboard');
    }
  };

  const addPet = () => {
    setPets([...pets, {
      name: '',
      species: '',
      ageYears: '',
      ageMonths: '',
      weight: '',
      weightUnit: 'lbs',
      specialNeeds: ''
    }]);
  };

  const removePet = (index: number) => {
    if (pets.length > 1) {
      setPets(pets.filter((_, i) => i !== index));
    }
  };

  const updatePet = (index: number, field: keyof PetFormData, value: string) => {
    const updatedPets = pets.map((pet, i) => 
      i === index ? { ...pet, [field]: value } : pet
    );
    setPets(updatedPets);
  };

  const validatePets = () => {
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      if (!pet.name.trim() || !pet.species) {
        alert(`Please fill in the name and species for pet ${i + 1}`);
        return false;
      }
      if (pet.weight && isNaN(parseFloat(pet.weight))) {
        alert(`Please enter a valid weight for ${pet.name}`);
        return false;
      }
      if (pet.ageYears && (isNaN(parseInt(pet.ageYears)) || parseInt(pet.ageYears) < 0)) {
        alert(`Please enter a valid age for ${pet.name}`);
        return false;
      }
      if (pet.ageMonths && (isNaN(parseInt(pet.ageMonths)) || parseInt(pet.ageMonths) < 0 || parseInt(pet.ageMonths) > 11)) {
        alert(`Age months must be between 0-11 for ${pet.name}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePets()) return;
    if (!user?.id) {
      alert('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert all pets
      const petInserts = pets.map(pet => ({
        owner_id: user.id,
        name: pet.name.trim(),
        species: pet.species,
        age_years: pet.ageYears ? parseInt(pet.ageYears) : null,
        age_months: pet.ageMonths ? parseInt(pet.ageMonths) : null,
        weight: pet.weight ? parseFloat(pet.weight) : null,
        weight_unit: pet.weightUnit,
        special_needs: pet.specialNeeds.trim() || null,
        is_active: true
      }));

      const { error } = await supabase
        .from('pets')
        .insert(petInserts);

      if (error) {
        console.error('Pet creation error:', error);
        throw error;
      }

      // Check if there's a pending quote request or redirect URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        const pendingRequest = localStorage.getItem('pending-quote-request');
        if (pendingRequest) {
          localStorage.removeItem('pending-quote-request');
          router.push('/request-quote');
        } else {
          router.push('/dashboard?success=onboarding-complete');
        }
      }
    } catch (error: any) {
      console.error('Error adding pets:', error);
      alert(`Error adding your pets: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip pet setup
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      const pendingRequest = localStorage.getItem('pending-quote-request');
      if (pendingRequest) {
        localStorage.removeItem('pending-quote-request');
        router.push('/request-quote');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tell Us About Your Pets
            </h1>
            <p className="text-gray-600">
              Add your pets so we can provide better transportation options
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {pets.map((pet, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pet {index + 1}
                    </h3>
                    {pets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePet(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        value={pet.name}
                        onChange={(e) => updatePet(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        placeholder="e.g., Buddy"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Species *
                      </label>
                      <select
                        value={pet.species}
                        onChange={(e) => updatePet(index, 'species', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        required
                      >
                        <option value="">Select species</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="ferret">Ferret</option>
                        <option value="reptile">Reptile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        value={pet.ageYears}
                        onChange={(e) => updatePet(index, 'ageYears', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        placeholder="e.g., 3"
                        min="0"
                        max="30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age (Months)
                      </label>
                      <input
                        type="number"
                        value={pet.ageMonths}
                        onChange={(e) => updatePet(index, 'ageMonths', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        placeholder="e.g., 6"
                        min="0"
                        max="11"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={pet.weight}
                          onChange={(e) => updatePet(index, 'weight', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                          placeholder="e.g., 45"
                          min="0"
                          step="0.1"
                        />
                        <select
                          value={pet.weightUnit}
                          onChange={(e) => updatePet(index, 'weightUnit', e.target.value as 'lbs' | 'kg')}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        >
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Needs or Medical Conditions
                    </label>
                    <textarea
                      value={pet.specialNeeds}
                      onChange={(e) => updatePet(index, 'specialNeeds', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="Any medical conditions, behavioral notes, or special care instructions..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addPet}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  + Add Another Pet
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Pets...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}