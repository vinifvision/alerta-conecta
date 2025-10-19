import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OccurrenceDetails from "./pages/OccurrenceDetails";
import NotFound from "./pages/NotFound";
import RegisterOccurrence from "./pages/RegisterOccurrence";
import UserProfile from "./pages/UserProfile";
import AuditLogs from "./pages/AuditLogs";

const queryClient = new QueryClient();
 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/occurrences/:id" element={<OccurrenceDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/occurrences/new" element={<RegisterOccurrence />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/audit" element={<AuditLogs />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;