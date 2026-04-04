import { Route, Routes } from "react-router";
import AuthProvider from "./lib/auth";
import RegisterPage from "./pages/register";
import DashboardUser from "./pages/dashboard/user";
import LoginPage from "./pages/login";
import LoanForm from "./pages/loan-form";
import Home from "./pages/home";
import { DashboardProtect } from "./components/dashboard-protect";
import DashboardAdmin from "./pages/dashboard/admin";
import LoanDetailPage from "./pages/loan/[id]/loan";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loan/:id" element={<LoanDetailPage />} />
          <Route
            path="/dashboard/user"
            element={
              <DashboardProtect>
                <DashboardUser />
              </DashboardProtect>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <DashboardProtect>
                <DashboardAdmin />
              </DashboardProtect>
            }
          />
          <Route path="/loan/form" element={<LoanForm />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
