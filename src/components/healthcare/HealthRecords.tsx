import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Activity, Heart, FileText, Calendar, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const vitalSigns = [
  { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal", trend: "stable" },
  { name: "Heart Rate", value: "72", unit: "bpm", status: "Normal", trend: "stable" },
  { name: "Weight", value: "175", unit: "lbs", status: "On Target", trend: "down" },
  { name: "Blood Sugar", value: "95", unit: "mg/dL", status: "Normal", trend: "stable" },
];

const medicalHistory = [
  { date: "Jan 10, 2025", type: "Check-up", provider: "Dr. Sarah Chen", notes: "Annual physical - all clear" },
  { date: "Dec 15, 2024", type: "Lab Work", provider: "Quest Diagnostics", notes: "Blood panel - normal ranges" },
  { date: "Nov 8, 2024", type: "Specialist", provider: "Dr. James Wilson", notes: "Dermatology - routine screening" },
  { date: "Oct 22, 2024", type: "Dental", provider: "Dr. Emily Park", notes: "Cleaning and check-up" },
];

const upcomingAppointments = [
  { date: "Feb 5, 2025", time: "10:00 AM", provider: "Dr. Sarah Chen", type: "Follow-up" },
  { date: "Mar 15, 2025", time: "2:30 PM", provider: "Dr. Emily Park", type: "Dental Cleaning" },
];

export function HealthRecords() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Health Score"
          value="92"
          subtitle="Excellent"
          icon={Heart}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Last Check-up"
          value="8 days"
          subtitle="Jan 10, 2025"
          icon={Stethoscope}
          status="healthy"
        />
        <MetricSignalCard
          title="Active Conditions"
          value="0"
          subtitle="No concerns"
          icon={Activity}
          status="healthy"
        />
        <MetricSignalCard
          title="Documents"
          value="24"
          subtitle="Records on file"
          icon={FileText}
          status="neutral"
        />
      </div>

      {/* Vital Signs */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Vital Signs</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {vitalSigns.map((vital, index) => (
            <motion.div
              key={vital.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-muted/20 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">{vital.name}</p>
              <p className="text-2xl font-bold text-foreground">
                {vital.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{vital.unit}</span>
              </p>
              <p className="text-xs text-secondary mt-1">{vital.status}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Medical History */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Medical History</h3>
          <div className="space-y-3">
            {medicalHistory.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{record.type}</span>
                  <span className="text-xs text-muted-foreground">{record.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{record.provider}</p>
                <p className="text-xs text-foreground/80 mt-1">{record.notes}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Appointments */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{apt.type}</p>
                  <p className="text-sm text-muted-foreground">{apt.provider}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{apt.date}</p>
                  <p className="text-xs text-muted-foreground">{apt.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors">
            Schedule New Appointment
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
