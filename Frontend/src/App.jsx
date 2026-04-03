import { Route, Routes } from "react-router";
import AuthProvider from "./lib/auth";
import RegisterPage from "./pages/Register";
import DashboardUser from "./pages/dashboard/User";
import LoginPage from "./pages/Login";
import LoanForm from "./pages/loan-form";
import Home from "./pages/Home";
import { DashboardProtect } from "./components/dashboard-protect";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/user"
            element={
              <DashboardProtect>
                <DashboardUser />
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
