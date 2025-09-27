import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import OCursor from "@/components/OCursor"; // 👈 custom cursor component
import "@/styles/ocursor.css"; // 👈 cursor styles

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OCursor /> {/* 👈 sitewide custom cursor */}
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* 👇 Root "/" now goes to Admin */}
          <Route path="/" element={<Admin />} />
          <Route path="/admin" element={<Admin />} />
          {/* Keep Index if you still want it accessible */}
          {/* <Route path="/index" element={<Index />} /> */}
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
