import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Receipt, FileText, Calculator, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const taxDeductions = [
  { name: "Charitable Donations", amount: 5000, verified: true },
  { name: "Home Office Expense", amount: 3200, verified: true },
  { name: "Business Travel", amount: 2800, verified: false },
  { name: "Professional Development", amount: 1500, verified: true },
  { name: "Medical Expenses", amount: 4200, verified: false },
];

const taxDocuments = [
  { name: "W-2 Form", status: "received", date: "Jan 15" },
  { name: "1099-DIV", status: "received", date: "Jan 18" },
  { name: "1099-INT", status: "pending", date: "Expected Jan 31" },
  { name: "Property Tax Statement", status: "received", date: "Dec 28" },
];

export function TaxDashboard() {
  const totalDeductions = taxDeductions.reduce((acc, d) => acc + d.amount, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Estimated Tax"
          value="$24,500"
          subtitle="Based on current data"
          icon={Calculator}
          status="neutral"
        />
        <MetricSignalCard
          title="Total Deductions"
          value={`$${totalDeductions.toLocaleString()}`}
          subtitle="5 categories tracked"
          icon={Receipt}
          status="healthy"
        />
        <MetricSignalCard
          title="Documents"
          value="3 of 4"
          subtitle="Received"
          icon={FileText}
          status="warning"
        />
        <MetricSignalCard
          title="Filing Deadline"
          value="87 days"
          subtitle="April 15, 2025"
          icon={Clock}
          status="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deductions Tracker */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Deductions Tracker</h3>
          <div className="space-y-3">
            {taxDeductions.map((deduction, index) => (
              <motion.div
                key={deduction.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${deduction.verified ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                    {deduction.verified ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <Clock className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{deduction.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {deduction.verified ? 'Verified' : 'Pending verification'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  ${deduction.amount.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Deductions</span>
              <span className="text-lg font-bold text-foreground">${totalDeductions.toLocaleString()}</span>
            </div>
          </div>
        </GlassCard>

        {/* Document Status */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Document Status</h3>
          <div className="space-y-3">
            {taxDocuments.map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <FileText className={`h-5 w-5 ${doc.status === 'received' ? 'text-secondary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  doc.status === 'received' 
                    ? 'bg-secondary/10 text-secondary' 
                    : 'bg-muted/30 text-muted-foreground'
                }`}>
                  {doc.status === 'received' ? 'Received' : 'Pending'}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
