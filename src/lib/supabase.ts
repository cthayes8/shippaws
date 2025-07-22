import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  user_type: 'pet_owner' | 'transporter'
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface TransporterProfile {
  id: string
  business_name?: string
  license_number?: string
  insurance_company?: string
  insurance_policy?: string
  vehicle_type?: string
  vehicle_capacity?: string
  service_radius: number
  base_rate?: number
  rate_per_mile?: number
  stripe_account_id?: string
  is_approved: boolean
  created_at: string
}

export interface TransportRequest {
  id: string
  user_id: string
  origin_zip: string
  destination_zip: string
  pet_type: string
  pet_size: string
  pet_name?: string
  preferred_date?: string
  special_instructions?: string
  status: 'active' | 'matched' | 'completed' | 'cancelled'
  created_at: string
}

export interface Bid {
  id: string
  request_id: string
  transporter_id: string
  price: number
  pickup_date: string
  delivery_date: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn'
  created_at: string
}

export interface Pet {
  id: string
  owner_id: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'ferret' | 'reptile' | 'other'
  age_years?: number
  age_months?: number
  weight?: number
  weight_unit: 'lbs' | 'kg'
  special_needs?: string
  photo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}