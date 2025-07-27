import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Professionals from "@/pages/Professionals";
import ClinicProfile from "@/pages/ProfessionalProfile";
import ClinicLanding from "@/pages/ClinicLanding";
import Booking from "@/pages/Booking";
import InstallmentSimulator from "@/pages/InstallmentSimulator";
import ClinicDashboard from "@/pages/ProfessionalDashboard";
import PatientArea from "@/pages/PatientArea";
import LoanRequest from "@/pages/LoanRequest";
import PaymentSystem from "@/pages/PaymentSystem";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HowItWorks from "@/pages/HowItWorks";
import Contact from "@/pages/Contact";
import Settings from "@/pages/Settings";
import ForgotPassword from "@/pages/ForgotPassword";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import ParcelamaisClinicas from "@/pages/ParcelamaisClinicas";
import ParcelamaisIntegration from "@/pages/ParcelamaisIntegration";
import ParcelamaisV2 from "@/pages/ParcelamaisV2";
import ParcelamaisCobrancas from "@/pages/ParcelamaisCobrancas";
import SiteMap from "@/pages/SiteMap";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/para-clinicas" element={<ClinicLanding />} />
        <Route path="/clinics" element={<Professionals />} />
        <Route path="/clinic/:id" element={<ClinicProfile />} />
        <Route path="/clinic-profile" element={<ClinicProfile />} />
        <Route path="/clinic-dashboard" element={
          <ProtectedRoute requireAdmin={false}>
            <ClinicDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute requireAdmin={false}>
            <ClinicDashboard />
          </ProtectedRoute>
        } />
        <Route path="/loan-request" element={
          <ProtectedRoute requireAdmin={false}>
            <LoanRequest />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={<Booking />} />
        <Route path="/installment-simulator" element={<InstallmentSimulator />} />

        <Route path="/patient-area" element={
          <ProtectedRoute requireAdmin={false}>
            <PatientArea />
          </ProtectedRoute>
        } />
        <Route path="/payment-system" element={<PaymentSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={
          <ProtectedRoute requireAdmin={false}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Rotas administrativas - ocultas da navegação pública mas funcionais */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parcelamais-clinicas" element={
          <ProtectedRoute requireAdmin={true}>
            <ParcelamaisClinicas />
          </ProtectedRoute>
        } />
        <Route path="/parcelamais" element={
          <ProtectedRoute requireAdmin={true}>
            <ParcelamaisIntegration />
          </ProtectedRoute>
        } />
        <Route path="/parcelamais-config" element={
          <ProtectedRoute requireAdmin={true}>
            <ParcelamaisIntegration />
          </ProtectedRoute>
        } />
        <Route path="/parcelamais-v2" element={
          <ProtectedRoute requireAdmin={true}>
            <ParcelamaisV2 />
          </ProtectedRoute>
        } />
        <Route path="/cobrancas" element={
          <ProtectedRoute requireAdmin={true}>
            <ParcelamaisCobrancas />
          </ProtectedRoute>
        } />
        <Route path="/sitemap" element={
          <ProtectedRoute requireAdmin={true}>
            <SiteMap />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}
