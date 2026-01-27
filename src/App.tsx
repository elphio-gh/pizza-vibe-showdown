import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import PlayerPage from "./pages/PlayerPage";
import AdminPage from "./pages/AdminPage";
import TVShowPage from "./pages/TVShowPage";
import NotFound from "./pages/NotFound";
import PlayerLoginPage from "./pages/PlayerLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import PlayerRejoinPage from "./pages/PlayerRejoinPage";
import PlayerSelectPage from "./pages/PlayerSelectPage";
import MyPizzaPage from "./pages/MyPizzaPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/tv" element={<TVShowPage />} />
            <Route path="/player-login" element={<PlayerLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/player-rejoin" element={<PlayerRejoinPage />} />
            <Route path="/player-select" element={<PlayerSelectPage />} />
            <Route path="/my-pizza" element={<MyPizzaPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;

