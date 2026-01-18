import { motion } from "framer-motion";
import { Home, TrendingUp, MapPin, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SignalCard } from "@/components/SignalCard";
import { MetricRing } from "@/components/MetricRing";

export function PropertyDashboard() {
  return (
    <div className="space-y-6">
      {/* Property Value Overview */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Primary Residence</span>
            </div>
            <h2 className="text-3xl font-display font-semibold text-foreground mb-1">$1,250,000</h2>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">+8.2% this year</span>
            </div>
          </div>
          <div className="flex gap-4">
            <MetricRing label="Equity" value="68%" percentage={68} color="gold" size={80} />
            <MetricRing label="ROI" value="12.4%" percentage={62} color="cyan" size={80} />
          </div>
        </div>
      </GlassCard>

      {/* Property Signals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SignalCard title="Mortgage" value="$2,840/mo" subtitle="15 years left" icon={DollarSign} status="healthy" />
        <SignalCard title="Property Tax" value="Due Apr 1" subtitle="$4,200" icon={DollarSign} status="attention" />
        <SignalCard title="Insurance" value="Active" subtitle="Renews Dec" icon={Home} status="healthy" />
        <SignalCard title="Neighborhood" value="A+" subtitle="Safety score" icon={MapPin} status="healthy" />
      </div>

      {/* Neighborhood Insights */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Neighborhood Insights</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Schools", score: 9, max: 10 },
            { label: "Transit", score: 8, max: 10 },
            { label: "Walkability", score: 7, max: 10 },
            { label: "Dining", score: 9, max: 10 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <div className="text-2xl font-display font-semibold text-foreground mb-1">
                {item.score}/{item.max}
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
