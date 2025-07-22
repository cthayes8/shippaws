import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'customer' | 'transporter';

interface UserProfile {
  id: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string; // For transporters
  vehicleType?: string; // For transporters
  isOnboarded: boolean;
}

interface AuthState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  onboardingStep: number;
  
  // Actions
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingStep: (step: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      isLoading: false,
      onboardingStep: 0,
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      setLoading: (loading) => set({ isLoading: loading }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      updateProfile: (updates) => {
        const currentProfile = get().userProfile;
        if (currentProfile) {
          set({ userProfile: { ...currentProfile, ...updates } });
        }
      },
      
      clearAuth: () => set({ 
        userProfile: null, 
        isLoading: false, 
        onboardingStep: 0 
      }),
    }),
    {
      name: 'ship-paws-auth',
      partialize: (state) => ({ 
        userProfile: state.userProfile,
        onboardingStep: state.onboardingStep 
      }),
    }
  )
);