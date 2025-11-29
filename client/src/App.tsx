import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ChatLayout from "./features/chat/layout/ChatLayout";
import { ChatArea } from "./features/chat/components/chat-area";
import LoginPage from "@/app/login/page"; // Senin oluşturduğun Page dosyasını buraya taşıdığını varsayıyorum
import SignupPage from "@/app/register/page";
import { useAuthStore } from "./store/useAuthStore";
import type { JSX } from "react";

// Kullanıcı giriş yapmamışsa Login'e atar
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Kullanıcı zaten giriş yapmışsa Login sayfasına girmesin
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  // Zustand persist otomatik olarak state'i yüklüyor, initializeAuth'a gerek yok

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Sayfaları (Public) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Ana Uygulama (Private) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatLayout>
                <ChatArea />
              </ChatLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
