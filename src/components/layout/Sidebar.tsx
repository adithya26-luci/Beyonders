import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Clock, Zap, Activity, Calendar, 
  Compass, Users, Shield, BarChart3, Bot, FileText,
  Leaf, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, short: 'Dash' },
  { path: '/climate-engine', label: 'Climate Engine', icon: Clock, short: 'Engine' },
  { path: '/climate-windows', label: 'Climate Windows', icon: Zap, short: 'Windows' },
  { path: '/real-time', label: 'Real-Time Monitor', icon: Activity, short: 'Monitor' },
  { path: '/daily-timeline', label: 'Daily Timeline', icon: Calendar, short: 'Timeline' },
  { path: '/activity-guidance', label: 'Activity Guidance', icon: Compass, short: 'Activity' },
  { path: '/planning', label: 'Climate Planning', icon: Users, short: 'Planning' },
  { path: '/recovery', label: 'Recovery Windows', icon: Shield, short: 'Recovery' },
  { path: '/predictions', label: 'Predictions & ML', icon: BarChart3, short: 'Predict' },
  { path: '/ai-assistant', label: 'AI Copilot', icon: Bot, short: 'AI' },
  { path: '/reports', label: 'Reports & Insights', icon: FileText, short: 'Reports' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border flex-shrink-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <span className="text-sm font-bold text-foreground tracking-tight">EcoVate</span>
            <p className="text-[10px] text-muted-foreground font-mono">Climate Intelligence</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-primary-foreground' : '')} />
              {!collapsed && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="text-xs font-medium truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg status-strained-bg">
            <div className="w-2 h-2 rounded-full bg-strained animate-pulse flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-strained">STRAINED</p>
              <p className="text-[9px] text-muted-foreground font-mono">Score: 58/100</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-sidebar-foreground" />
          : <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
        }
      </button>
    </motion.aside>
  );
}
