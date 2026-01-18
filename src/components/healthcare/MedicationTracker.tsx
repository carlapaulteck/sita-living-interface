import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Pill, Clock, AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const medications = [
  { 
    name: "Vitamin D3", 
    dosage: "2000 IU", 
    frequency: "Daily", 
    time: "Morning",
    remaining: 45,
    totalSupply: 90,
    takenToday: true
  },
  { 
    name: "Omega-3", 
    dosage: "1000mg", 
    frequency: "Daily", 
    time: "With dinner",
    remaining: 22,
    totalSupply: 60,
    takenToday: false
  },
  { 
    name: "Magnesium", 
    dosage: "400mg", 
    frequency: "Daily", 
    time: "Before bed",
    remaining: 8,
    totalSupply: 30,
    takenToday: false
  },
  { 
    name: "Multivitamin", 
    dosage: "1 tablet", 
    frequency: "Daily", 
    time: "Morning",
    remaining: 60,
    totalSupply: 100,
    takenToday: true
  },
];

const interactions = [
  { severity: "low", message: "Vitamin D and Magnesium are best absorbed when taken separately" },
];

export function MedicationTracker() {
  const adherenceRate = Math.round((medications.filter(m => m.takenToday).length / medications.length) * 100);
  const needsRefill = medications.filter(m => m.remaining < 15).length;
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Today's Adherence"
          value={`${adherenceRate}%`}
          subtitle={`${medications.filter(m => m.takenToday).length} of ${medications.length} taken`}
          icon={CheckCircle2}
          status={adherenceRate >= 80 ? "healthy" : "warning"}
        />
        <MetricSignalCard
          title="Active Medications"
          value={medications.length.toString()}
          subtitle="Being tracked"
          icon={Pill}
          status="neutral"
        />
        <MetricSignalCard
          title="Needs Refill"
          value={needsRefill.toString()}
          subtitle="Low supply"
          icon={RefreshCcw}
          status={needsRefill > 0 ? "warning" : "healthy"}
        />
        <MetricSignalCard
          title="Interactions"
          value={interactions.length.toString()}
          subtitle="To monitor"
          icon={AlertTriangle}
          status={interactions.length > 0 ? "warning" : "healthy"}
        />
      </div>

      {/* Medication List */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Medications</h3>
        <div className="space-y-4">
          {medications.map((med, index) => (
            <motion.div
              key={med.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${med.takenToday ? 'bg-secondary/5 border border-secondary/20' : 'bg-muted/20'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${med.takenToday ? 'bg-secondary/10' : 'bg-muted/30'}`}>
                    {med.takenToday ? (
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    ) : (
                      <Pill className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{med.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${med.remaining < 15 ? 'text-destructive' : 'text-foreground'}`}>
                    {med.remaining} remaining
                  </p>
                  <div className="w-20 h-1.5 bg-muted/30 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${med.remaining < 15 ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${(med.remaining / med.totalSupply) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Interactions Alert */}
      {interactions.length > 0 && (
        <GlassCard className="p-6 border-primary/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Interaction Notes</h4>
              {interactions.map((interaction, index) => (
                <p key={index} className="text-sm text-muted-foreground">{interaction.message}</p>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
