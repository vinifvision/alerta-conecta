// src/App.tsx (Corrigido)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

// Importando suas páginas
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OccurrenceDetails from "./pages/OccurrenceDetails";
import NotFound from "./pages/NotFound";
import RegisterOccurrence from "./pages/RegisterOccurrence";
import UserProfile from "./pages/UserProfile";
import AuditLogs from "./pages/AuditLogs";

// Importando o hook e o componente de rota
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Rota de Login (Pública) */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />

          {/* --- ROTAS PROTEGIDAS --- */}

          {/* 1. ATUALIZADO: Rotas de Admin -> Agora "Gerente" */}
          <Route element={<ProtectedRoute allowedRoles={["Gerente"]} />}>
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* 2. ATUALIZADO: Rotas de todos os usuários logados */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["Gerente", "Analista de Sistemas", "Técnico de Suporte"]}
              />
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/occurrences/:id" element={<OccurrenceDetails />} />
            <Route path="/occurrences/new" element={<RegisterOccurrence />} />
          </Route>

          {/* Rota "Não Encontrado" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
