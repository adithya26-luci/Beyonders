import { useState } from 'react';
import { motion } from 'framer-motion';
import { activityGuidance } from '@/data/mockData';
import { StatusBadge, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { Clock, CheckCircle, XCircle, AlertCircle, User, School, Briefcase, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClimateStatus } from '@/data/mockData';

const userTypes = [
  { id: 'family', label: 'Family', icon: User },
  { id: 'school', label: 'School', icon: School },
  { id: 'business', label: 'Small Business', icon: Briefcase },
  { id: 'office', label: 'Office', icon: Building2 },
];

const shiftLog = [
  { activity: 'Delivery rescheduled', from: '2:00 PM', to: '6:30 AM', user: 'FastDeliver Co.', saved: '2.1 hrs heat exposure' },
  { activity: 'School PE moved', from: '11:30 AM', to: '7:00 AM', user: 'Greenfield School', saved: 'Critical exposure avoided' },
  { activity: 'Gym session shifted', from: '12:00 PM', to: '5:30 AM', user: 'User #1842', saved: '90 min strained avoided' },
  { activity: 'Market visit moved', from: '1:00 PM', to: '8:30 PM', user: 'Family Unit #284', saved: 'Critical + strained avoided' },
];

export default function ActivityGuidance() {
  const [selectedType, setSelectedType] = useState('family');

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Activity Guidance"
        subtitle="AI-powered personalized scheduling based on real-time climate conditions"
      />

      {/* User Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {userTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all',
                selectedType === type.id
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activityGuidance.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn(
              'card-eco rounded-xl p-4 border',
              item.risk === 'critical' ? 'border-critical/25' :
              item.risk === 'strained' ? 'border-strained/25' : 'border-safe/25'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.activity}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.reason}</p>
                  </div>
                  <StatusBadge status={item.risk as ClimateStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-safe/10 border border-safe/25 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3 h-3 text-safe" />
                      <span className="text-[9px] text-safe font-semibold uppercase">Best Time</span>
                    </div>
                    <p className="text-xs font-mono text-foreground">{item.bestTime}</p>
                  </div>
                  <div className="bg-surface-2 rounded-lg p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground uppercase">Next Window</span>
                    </div>
                    <p className="text-xs font-mono text-primary">{item.nextWindow}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Warnings */}
      <SectionCard title="⚠️ Current Activity Warnings">
        <div className="space-y-2">
          {[
            { icon: <XCircle className="w-4 h-4 text-critical" />, text: 'Outdoor exercise NOT recommended — Heat index 41°C', severity: 'critical' },
            { icon: <XCircle className="w-4 h-4 text-critical" />, text: 'School outdoor PE should be cancelled for this afternoon', severity: 'critical' },
            { icon: <AlertCircle className="w-4 h-4 text-strained" />, text: 'Light outdoor tasks possible with water breaks every 20 min', severity: 'strained' },
            { icon: <CheckCircle className="w-4 h-4 text-safe" />, text: 'Evening window opens at 8:00 PM — safe for outdoor activity', severity: 'safe' },
          ].map((w, i) => (
            <div key={i} className={cn(
              'flex items-center gap-3 p-3 rounded-lg',
              w.severity === 'critical' ? 'status-critical-bg' :
              w.severity === 'strained' ? 'status-strained-bg' : 'status-safe-bg'
            )}>
              {w.icon}
              <p className="text-xs text-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Behavior Shift Log */}
      <SectionCard title="Behavior Shift Log — Community Actions">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Activity</th>
                <th className="text-left py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">From</th>
                <th className="text-left py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">To</th>
                <th className="text-left py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Entity</th>
                <th className="text-left py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Impact</th>
              </tr>
            </thead>
            <tbody>
              {shiftLog.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2.5 text-foreground font-medium">{row.activity}</td>
                  <td className="py-2.5 font-mono text-muted-foreground line-through">{row.from}</td>
                  <td className="py-2.5 font-mono text-primary">{row.to}</td>
                  <td className="py-2.5 text-muted-foreground">{row.user}</td>
                  <td className="py-2.5 text-safe">{row.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
