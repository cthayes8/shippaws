'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface LocationData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, locationData?: LocationData) => void;
  className?: string;
  required?: boolean;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  required = false
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    // Initialize Google Places services
    if (typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    }
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (!autocompleteService.current || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    const request = {
      input,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' },
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length >= 3) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: suggestion.place_id,
      fields: ['formatted_address', 'address_components', 'geometry']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        let city = '';
        let state = '';
        let zipCode = '';

        place.address_components?.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          } else if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const locationData: LocationData = {
          address: place.formatted_address || suggestion.description,
          city,
          state,
          zipCode,
          coordinates: place.geometry?.location ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          } : undefined
        };

        onChange(suggestion.description, locationData);
        setShowSuggestions(false);
        setSuggestions([]);
      }
    });
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="block text-base md:text-lg font-bold text-gray-900 mb-1">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/95 backdrop-blur-sm"
          required={required}
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-600">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}