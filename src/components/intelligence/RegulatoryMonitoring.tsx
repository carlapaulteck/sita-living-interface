import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Shield, AlertTriangle, CheckCircle2, Clock, FileText, Bell } from "lucide-react";
import { motion } from "framer-motion";

const platformUpdates = [
  { 
    platform: "Meta", 
    change: "New ad transparency requirements", 
    impact: "medium",
    deadline: "Mar 1, 2025",
    status: "action_required"
  },
  { 
    platform: "Google", 
    change: "Updated privacy policy for data handling", 
    impact: "low",
    deadline: "Feb 15, 2025",
    status: "compliant"
  },
  { 
    platform: "Stripe", 
    change: "Enhanced fraud detection parameters", 
    impact: "low",
    deadline: "Immediate",
    status: "compliant"
  },
  { 
    platform: "AWS", 
    change: "New data residency requirements for EU", 
    impact: "high",
    deadline: "Apr 1, 2025",
    status: "action_required"
  },
];

const complianceChecklist = [
  { item: "GDPR Data Processing Agreement", status: "completed" },
  { item: "Cookie Consent Banner", status: "completed" },
  { item: "Privacy Policy Update", status: "pending" },
  { item: "Data Retention Policy", status: "completed" },
  { item: "User Data Export Feature", status: "in_progress" },
];

export function RegulatoryMonitoring() {
  const actionRequired = platformUpdates.filter(u => u.status === 'action_required').length;
  const completedItems = complianceChecklist.filter(c => c.status === 'completed').length;
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Compliance Score"
          value="87%"
          subtitle="Good standing"
          icon={Shield}
          status="healthy"
        />
        <MetricSignalCard
          title="Action Required"
          value={actionRequired.toString()}
          subtitle="Updates pending"
          icon={AlertTriangle}
          status={actionRequired > 0 ? "warning" : "healthy"}
        />
        <MetricSignalCard
          title="Platforms Monitored"
          value="12"
          subtitle="Active tracking"
          icon={Bell}
          status="neutral"
        />
        <MetricSignalCard
          title="Last Audit"
          value="5 days"
          subtitle="Jan 13, 2025"
          icon={FileText}
          status="healthy"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Updates */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Platform Policy Updates</h3>
          <div className="space-y-3">
            {platformUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  update.status === 'action_required' 
                    ? 'bg-primary/5 border border-primary/20' 
                    : 'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{update.platform}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      update.impact === 'high' ? 'bg-destructive/10 text-destructive' :
                      update.impact === 'medium' ? 'bg-primary/10 text-primary' :
                      'bg-muted/30 text-muted-foreground'
                    }`}>
                      {update.impact} impact
                    </span>
                  </div>
                  {update.status === 'compliant' ? (
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{update.change}</p>
                <p className="text-xs text-muted-foreground">Deadline: {update.deadline}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Compliance Checklist */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Compliance Checklist</h3>
            <span className="text-sm text-muted-foreground">{completedItems}/{complianceChecklist.length}</span>
          </div>
          <div className="space-y-3">
            {complianceChecklist.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full ${
                    item.status === 'completed' ? 'bg-secondary/10' :
                    item.status === 'in_progress' ? 'bg-primary/10' :
                    'bg-muted/30'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : item.status === 'in_progress' ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    item.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {item.item}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                  item.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                  'bg-muted/30 text-muted-foreground'
                }`}>
                  {item.status === 'completed' ? 'Done' :
                   item.status === 'in_progress' ? 'In Progress' : 'Pending'}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
