import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Syringe, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const vaccines = [
  { name: "COVID-19 Booster", status: "due", dueDate: "Feb 2025", lastDose: "Aug 2024" },
  { name: "Flu Shot", status: "completed", completedDate: "Oct 2024", nextDue: "Oct 2025" },
  { name: "Tdap", status: "completed", completedDate: "Mar 2022", nextDue: "Mar 2032" },
  { name: "Shingles (Shingrix)", status: "not_started", recommendedAge: "50+", notes: "2-dose series" },
  { name: "Pneumococcal", status: "not_applicable", recommendedAge: "65+", notes: "Currently not recommended" },
];

const familyVaccines = [
  { member: "Sarah (Spouse)", vaccine: "Flu Shot", status: "completed", date: "Oct 2024" },
  { member: "Emily (Child)", vaccine: "MMR Booster", status: "due", date: "Mar 2025" },
  { member: "Max (Child)", vaccine: "Flu Shot", status: "completed", date: "Nov 2024" },
];

export function VaccineScheduler() {
  const completedCount = vaccines.filter(v => v.status === 'completed').length;
  const dueCount = vaccines.filter(v => v.status === 'due').length;
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Up to Date"
          value={completedCount.toString()}
          subtitle="Vaccines current"
          icon={CheckCircle2}
          status="healthy"
        />
        <MetricSignalCard
          title="Due Soon"
          value={dueCount.toString()}
          subtitle="Needs attention"
          icon={Clock}
          status={dueCount > 0 ? "warning" : "healthy"}
        />
        <MetricSignalCard
          title="Family Members"
          value="4"
          subtitle="Being tracked"
          icon={Syringe}
          status="neutral"
        />
        <MetricSignalCard
          title="Next Due"
          value="Feb 2025"
          subtitle="COVID-19 Booster"
          icon={Calendar}
          status="warning"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Vaccines */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Immunization Record</h3>
          <div className="space-y-3">
            {vaccines.map((vaccine, index) => (
              <motion.div
                key={vaccine.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  vaccine.status === 'completed' ? 'bg-secondary/5 border border-secondary/20' :
                  vaccine.status === 'due' ? 'bg-primary/5 border border-primary/20' :
                  'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${
                      vaccine.status === 'completed' ? 'bg-secondary/10' :
                      vaccine.status === 'due' ? 'bg-primary/10' :
                      'bg-muted/30'
                    }`}>
                      {vaccine.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      ) : vaccine.status === 'due' ? (
                        <AlertCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <Syringe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vaccine.name}</p>
                      {vaccine.status === 'completed' && (
                        <p className="text-xs text-muted-foreground">
                          Completed {vaccine.completedDate} • Next: {vaccine.nextDue}
                        </p>
                      )}
                      {vaccine.status === 'due' && (
                        <p className="text-xs text-primary">
                          Due {vaccine.dueDate} • Last dose: {vaccine.lastDose}
                        </p>
                      )}
                      {(vaccine.status === 'not_started' || vaccine.status === 'not_applicable') && (
                        <p className="text-xs text-muted-foreground">
                          {vaccine.recommendedAge} • {vaccine.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vaccine.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                    vaccine.status === 'due' ? 'bg-primary/10 text-primary' :
                    'bg-muted/30 text-muted-foreground'
                  }`}>
                    {vaccine.status === 'completed' ? 'Current' :
                     vaccine.status === 'due' ? 'Due' :
                     vaccine.status === 'not_started' ? 'Optional' : 'N/A'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Family Vaccines */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Family Immunizations</h3>
          <div className="space-y-3">
            {familyVaccines.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/20"
              >
                <div>
                  <p className="font-medium text-foreground">{record.member}</p>
                  <p className="text-sm text-muted-foreground">{record.vaccine}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                  }`}>
                    {record.status === 'completed' ? 'Done' : 'Due'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors">
            Add Family Member
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
