'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export default function LocationInput({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  required = false
}: LocationInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="block text-base md:text-lg font-bold text-gray-900 mb-1">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white/95 backdrop-blur-sm"
          required={required}
        />
        <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
          focused ? 'text-red-500' : 'text-gray-400'
        }`} />
      </div>
    </div>
  );
}