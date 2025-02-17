import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "@/pages/errors/NotFound";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Home from "@/pages/main/Home";

import BaseLayout from "@/layouts/BaseLayout";
import AppLayout from "@/layouts/AppLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyMfa from "./pages/main/VerifyMfa";

import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import { useAuth } from "./lib/auth-service";

const App = () => {
  const { user, isLoading } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute
              isPublic
              isAuthenticated={!!user}
              isLoading={isLoading}
            >
              <BaseLayout />
            </ProtectedRoute>
          }
        >
          <Route path="sign-in" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-mfa" element={<VerifyMfa />} />
        </Route>

        <Route
          element={
            <ProtectedRoute isAuthenticated={!!user} isLoading={isLoading}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
