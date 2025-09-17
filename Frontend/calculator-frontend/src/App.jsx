import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import HomePage from "./pages/homepage/HomePage";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import { AuthProvider } from "./context/AuthContext"; 
import ClientDashboard from "./pages/client/ClientDashboard";
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
            <Route path="/client" element={<ClientDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
