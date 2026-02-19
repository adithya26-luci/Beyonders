import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ClimateTimeEngine from "./pages/ClimateTimeEngine";
import ShortClimateWindows from "./pages/ShortClimateWindows";
import RealTimeMonitor from "./pages/RealTimeMonitor";
import DailyTimeline from "./pages/DailyTimeline";
import ActivityGuidance from "./pages/ActivityGuidance";
import ClimatePlanning from "./pages/ClimatePlanning";
import RecoveryWindow from "./pages/RecoveryWindow";
import PredictionsAnalytics from "./pages/PredictionsAnalytics";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climate-engine" element={<ClimateTimeEngine />} />
            <Route path="/climate-windows" element={<ShortClimateWindows />} />
            <Route path="/real-time" element={<RealTimeMonitor />} />
            <Route path="/daily-timeline" element={<DailyTimeline />} />
            <Route path="/activity-guidance" element={<ActivityGuidance />} />
            <Route path="/planning" element={<ClimatePlanning />} />
            <Route path="/recovery" element={<RecoveryWindow />} />
            <Route path="/predictions" element={<PredictionsAnalytics />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
