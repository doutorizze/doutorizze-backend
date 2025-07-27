import { create } from 'zustand';
import { buildApiUrl, API_ENDPOINTS } from '@/config/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'patient' | 'clinic' | 'admin';
  address?: string;
  birthDate?: string;
  gender?: string;
  cpf?: string;
  avatar?: string;
  // Clinic specific fields
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cro?: string;
  responsavelTecnico?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  servicos?: string[];
  horarioFuncionamento?: string;
  especialidades?: string;
  isParcelamaisAuthenticated?: boolean;
  // Admin specific fields
  role?: 'master_admin' | 'regional_admin';
  permissions?: string[];
}

interface Clinic {
  id: string;
  nomeFantasia: string;
  razaoSocial?: string;
  cnpj?: string;
  cro?: string;
  responsavelTecnico?: string;
  rating: number;
  reviewCount?: number;
  price: number | string;
  avatar: string;
  endereco?: string;
  cidade: string;
  estado: string;
  cep?: string;
  servicos?: string[];
  description?: string;
  availableSlots?: string[];
  // Propriedades adicionais dos dados mock
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  specialties?: string;
  working_hours?: string;
  created_at?: string;
  owner_name?: string;
  distance?: number;
  distanceText?: string;
}

interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  servico: string;
  installments?: {
    total: number;
    paid: number;
    amount: number;
  };
}

interface InstallmentPlan {
  id: string;
  appointmentId: string;
  totalAmount: number;
  installments: number;
  monthlyAmount: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface LoanRequest {
  id: string;
  patientId: string;
  clinicId: string;
  appointmentId: string;
  amount: number;
  installments: number;
  status: 'patient_requested' | 'clinic_approved' | 'clinic_rejected' | 'sent_to_admin' | 'admin_processing' | 'admin_approved' | 'admin_rejected' | 'parcelamais_approved' | 'parcelamais_rejected';
  requestDate: string;
  clinicApprovalDate?: string;
  adminProcessingDate?: string;
  finalDecisionDate?: string;
  rejectionReason?: string;
  parcelamaisProposalId?: string;
  clinicNotes?: string;
  adminNotes?: string;
}

interface AppState {
  user: User | null;
  clinics: Clinic[];
  appointments: Appointment[];
  installmentPlans: InstallmentPlan[];
  loanRequests: LoanRequest[];
  searchFilters: {
    servico: string;
    location: string;
    priceRange: [number, number];
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setClinics: (clinics: Clinic[]) => void;
  loadClinics: () => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addInstallmentPlan: (plan: InstallmentPlan) => void;
  updateSearchFilters: (filters: Partial<AppState['searchFilters']>) => void;
  // Loan request actions
  addLoanRequest: (request: LoanRequest) => void;
  updateLoanRequest: (id: string, updates: Partial<LoanRequest>) => void;
  getLoanRequestsByClinic: (clinicId: string) => LoanRequest[];
  getLoanRequestsByStatus: (status: LoanRequest['status']) => LoanRequest[];
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  loanRequests: [],
  clinics: [], // Dados serão carregados do backend
  appointments: [],
  installmentPlans: [],
  searchFilters: {
    servico: '',
    location: '',
    priceRange: [0, 1000]
  },
  
  setUser: (user) => set({ user }),
  setClinics: (clinics) => set({ clinics }),
  
  // Função para carregar clínicas do backend
  loadClinics: async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.clinicsPublic));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ clinics: data.clinics || [] });
    } catch (error) {
      console.error('Erro ao carregar clínicas:', error);
      set({ clinics: [] });
    }
  },
  addAppointment: (appointment) => set((state) => ({ 
    appointments: [...state.appointments, appointment] 
  })),
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    )
  })),
  addInstallmentPlan: (plan) => set((state) => ({
    installmentPlans: [...state.installmentPlans, plan]
  })),
  updateSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
  
  // Loan request actions
  addLoanRequest: (request) => set((state) => ({
    loanRequests: [...state.loanRequests, request]
  })),
  
  updateLoanRequest: (id, updates) => set((state) => ({
    loanRequests: state.loanRequests.map(req => 
      req.id === id ? { ...req, ...updates } : req
    )
  })),
  
  getLoanRequestsByClinic: (clinicId) => {
    const state = get();
    return state.loanRequests.filter(req => req.clinicId === clinicId);
  },
  
  getLoanRequestsByStatus: (status) => {
    const state = get();
    return state.loanRequests.filter(req => req.status === status);
  }
}));