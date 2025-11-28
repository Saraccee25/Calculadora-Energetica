import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import HomePage from "./pages/homepage/HomePage";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import { AuthProvider } from "./context/AuthContext";
import ClientDashboard from "./pages/client/ClientDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Recover from "./components/recover/recover";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";
import CalculatorPage from "./pages/calculator/CalculatorPage";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/recover" element={<Recover />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/calculadora" element={<CalculatorPage />} />
            <Route
              path="/client"
              element={
                <ProtectedRoute requiredRole={2}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
