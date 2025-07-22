import { create } from 'zustand';

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'ferret' | 'reptile' | 'other';
  breed?: string;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  age: number;
  specialNeeds?: string;
  vetRecords?: string[];
}

export interface TransportRequest {
  id: string;
  customerId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  pets: Pet[];
  preferredDate: Date;
  flexibleDates: boolean;
  timePreference: 'morning' | 'afternoon' | 'evening' | 'anytime';
  specialRequirements?: string;
  budget?: number;
  status: 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: string;
  transportRequestId: string;
  transporterId: string;
  amount: number;
  estimatedDuration: string; // e.g., "2-3 days"
  coverLetter: string;
  vehicleDetails: {
    type: string;
    model: string;
    year: number;
    features: string[];
  };
  insuranceVerified: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
}

interface MarketplaceState {
  // Transport Request Creation
  currentRequest: Partial<TransportRequest> | null;
  requestStep: number;
  
  // Bids
  activeBids: Bid[];
  
  // UI State
  showBidModal: boolean;
  selectedRequestId: string | null;
  
  // Actions
  setCurrentRequest: (request: Partial<TransportRequest> | null) => void;
  updateCurrentRequest: (updates: Partial<TransportRequest>) => void;
  setRequestStep: (step: number) => void;
  
  setActiveBids: (bids: Bid[]) => void;
  addBid: (bid: Bid) => void;
  updateBid: (bidId: string, updates: Partial<Bid>) => void;
  
  setShowBidModal: (show: boolean) => void;
  setSelectedRequestId: (id: string | null) => void;
  
  clearCurrentRequest: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  // Transport Request Creation
  currentRequest: null,
  requestStep: 0,
  
  // Bids
  activeBids: [],
  
  // UI State
  showBidModal: false,
  selectedRequestId: null,
  
  // Actions
  setCurrentRequest: (request) => set({ currentRequest: request }),
  
  updateCurrentRequest: (updates) => {
    const current = get().currentRequest;
    if (current) {
      set({ currentRequest: { ...current, ...updates } });
    }
  },
  
  setRequestStep: (step) => set({ requestStep: step }),
  
  setActiveBids: (bids) => set({ activeBids: bids }),
  
  addBid: (bid) => {
    const bids = get().activeBids;
    set({ activeBids: [...bids, bid] });
  },
  
  updateBid: (bidId, updates) => {
    const bids = get().activeBids;
    const updatedBids = bids.map(bid => 
      bid.id === bidId ? { ...bid, ...updates } : bid
    );
    set({ activeBids: updatedBids });
  },
  
  setShowBidModal: (show) => set({ showBidModal: show }),
  setSelectedRequestId: (id) => set({ selectedRequestId: id }),
  
  clearCurrentRequest: () => set({ 
    currentRequest: null, 
    requestStep: 0 
  }),
}));