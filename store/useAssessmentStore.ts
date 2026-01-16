import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const generateCertNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, ''); // 20240522
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
  return `MAE-${dateStr}-${randomStr}`;
};

// 1. Door Interface
export interface Door {
  id: string;
  labelId: string;
  location: string;
  floorLevel: string;
  responses: Record<number, 'Pass' | 'Fail' | 'N/A'>;
  images: string[]; 
  notes: string;
  actionRequired?: string;
}

// 2. Site Details Interface
export interface SiteDetails {
  businessName: string;
  customerName: string;
  siteAddress: string;
  customerPhone: string;
  customerEmail: string;
  certNumber: string;
  doorCount: number;
  engineerInitials: string;
  remedialRequired: boolean;
  engineerSignature: string;
}

// 3. Store Interface
interface AssessmentStore {
  siteDetails: SiteDetails;
  doors: Door[];
  isSidebarCollapsed: boolean; // Add this
  setSiteDetails: (details: Partial<SiteDetails>) => void;
  initializeDoors: (count: number) => void;
  updateDoor: (id: string, door: Partial<Door>) => void;
  deleteDoor: (id: string) => void;
  toggleSidebar: () => void; // Add this
  resetForm: () => void;
}

const initialState = {
  siteDetails: {
    businessName: '',
    customerName: '',
    siteAddress: '',
    customerPhone: '',
    customerEmail: '',
    certNumber: generateCertNumber(), // Auto-fills on load
    doorCount: 0,
    engineerInitials: '',
    remedialRequired: false,
    engineerSignature: '',
  },
  doors: [],
  isSidebarCollapsed: false, // Default to visible
};

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSiteDetails: (details) =>
        set((state) => ({ siteDetails: { ...state.siteDetails, ...details } })),

      initializeDoors: (count) => {
        const newDoors = Array.from({ length: count }).map((_, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          labelId: `D${i + 1}`,
          location: '',
          floorLevel: '',
          responses: {},
          images: [],
          notes: ''
        }));
        set({ doors: newDoors });
      },

      // Logic to flip the sidebar state
      toggleSidebar: () => 
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      updateDoor: (id, updatedFields) =>
        set((state) => ({
          doors: state.doors.map((d) => d.id === id ? { ...d, ...updatedFields } : d),
        })),

      deleteDoor: (id) =>
        set((state) => ({
          doors: state.doors.filter((d) => d.id !== id),
        })),

      resetForm: () => {
        if (window.confirm("Clear all data and start new audit?")) {
          set(initialState);
        }
      },
    }),
    { name: 'metro-pat-assessment-storage' }
  )
);