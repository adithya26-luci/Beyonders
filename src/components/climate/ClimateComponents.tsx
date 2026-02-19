import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ClimateStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: ClimateStatus;
  score?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPulse?: boolean;
}

const statusConfig = {
  safe: {
    label: 'SAFE',
    bgClass: 'status-safe-bg',
    textClass: 'text-safe',
    dotClass: 'bg-safe',
    glowClass: 'glow-safe',
  },
  strained: {
    label: 'STRAINED',
    bgClass: 'status-strained-bg',
    textClass: 'text-strained',
    dotClass: 'bg-strained',
    glowClass: 'glow-strained',
  },
  critical: {
    label: 'CRITICAL',
    bgClass: 'status-critical-bg',
    textClass: 'text-critical',
    dotClass: 'bg-critical',
    glowClass: 'glow-critical',
  },
};

export function StatusBadge({ status, score, size = 'md', showPulse = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (size === 'xl') {
    return (
      <div className={cn('inline-flex items-center gap-3 px-6 py-3 rounded-2xl', config.bgClass)}>
        {showPulse && (
          <div className="relative">
            <div className={cn('w-3 h-3 rounded-full', config.dotClass)} />
            {status === 'critical' && (
              <div className={cn('absolute inset-0 w-3 h-3 rounded-full animate-ping', config.dotClass, 'opacity-50')} />
            )}
          </div>
        )}
        <div>
          <p className={cn('text-lg font-bold tracking-widest', config.textClass)}>{config.label}</p>
          {score !== undefined && (
            <p className="text-xs text-muted-foreground font-mono">Stress Score: {score}/100</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-lg',
      size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5',
      config.bgClass
    )}>
      {showPulse && (
        <div className={cn('rounded-full flex-shrink-0',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          config.dotClass,
          status === 'critical' ? 'animate-pulse' : ''
        )} />
      )}
      <span className={cn('font-bold tracking-wider', config.textClass,
        size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
      )}>
        {config.label}
      </span>
      {score !== undefined && (
        <span className="text-muted-foreground font-mono text-[10px]">{score}</span>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: ClimateStatus;
  subtitle?: string;
}

export function MetricCard({ label, value, unit, icon, trend, status, subtitle }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'card-eco rounded-xl p-4',
        status === 'critical' && 'border-critical/30',
        status === 'strained' && 'border-strained/30',
        status === 'safe' && 'border-safe/30',
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        {icon && (
          <div className={cn('p-1.5 rounded-lg',
            status === 'critical' ? 'bg-critical/10 text-critical' :
            status === 'strained' ? 'bg-strained/10 text-strained' :
            status === 'safe' ? 'bg-safe/10 text-safe' :
            'bg-primary/10 text-primary'
          )}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold',
          status === 'critical' ? 'text-critical' :
          status === 'strained' ? 'text-strained' :
          status === 'safe' ? 'text-safe' :
          'text-foreground'
        )}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SectionCard({ title, children, className }: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('card-eco rounded-xl p-5', className)}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
