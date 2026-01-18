import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Truck, Package, AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const vendors = [
  { 
    name: "Primary Supplier Co", 
    reliability: 98, 
    leadTime: "3-5 days",
    risk: "low",
    lastDelivery: "On time"
  },
  { 
    name: "Tech Components Ltd", 
    reliability: 85, 
    leadTime: "7-10 days",
    risk: "medium",
    lastDelivery: "2 days late"
  },
  { 
    name: "Packaging Solutions", 
    reliability: 92, 
    leadTime: "2-3 days",
    risk: "low",
    lastDelivery: "On time"
  },
  { 
    name: "Global Materials Inc", 
    reliability: 72, 
    leadTime: "14-21 days",
    risk: "high",
    lastDelivery: "5 days late"
  },
];

const riskCategories = [
  { type: "Delivery Delays", count: 2, trend: "down" },
  { type: "Quality Issues", count: 0, trend: "stable" },
  { type: "Price Volatility", count: 1, trend: "up" },
  { type: "Capacity Constraints", count: 1, trend: "stable" },
  { type: "Geopolitical", count: 0, trend: "stable" },
];

const activeOrders = [
  { id: "PO-2025-001", vendor: "Primary Supplier Co", status: "in_transit", eta: "Jan 22" },
  { id: "PO-2025-002", vendor: "Tech Components Ltd", status: "processing", eta: "Jan 28" },
  { id: "PO-2025-003", vendor: "Packaging Solutions", status: "delivered", eta: "Completed" },
];

export function SupplyChainIntel() {
  const avgReliability = Math.round(vendors.reduce((acc, v) => acc + v.reliability, 0) / vendors.length);
  const highRiskCount = vendors.filter(v => v.risk === 'high').length;
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Vendor Reliability"
          value={`${avgReliability}%`}
          subtitle="Average score"
          icon={CheckCircle2}
          status={avgReliability >= 90 ? "healthy" : avgReliability >= 80 ? "warning" : "critical"}
        />
        <MetricSignalCard
          title="Active Vendors"
          value={vendors.length.toString()}
          subtitle="Being tracked"
          icon={Truck}
          status="neutral"
        />
        <MetricSignalCard
          title="High Risk"
          value={highRiskCount.toString()}
          subtitle="Vendors flagged"
          icon={AlertTriangle}
          status={highRiskCount > 0 ? "warning" : "healthy"}
        />
        <MetricSignalCard
          title="Open Orders"
          value={activeOrders.filter(o => o.status !== 'delivered').length.toString()}
          subtitle="In progress"
          icon={Package}
          status="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendor Health */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vendor Health</h3>
          <div className="space-y-4">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  vendor.risk === 'high' ? 'bg-destructive/5 border border-destructive/20' :
                  vendor.risk === 'medium' ? 'bg-primary/5 border border-primary/20' :
                  'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">Lead time: {vendor.leadTime}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vendor.risk === 'high' ? 'bg-destructive/10 text-destructive' :
                    vendor.risk === 'medium' ? 'bg-primary/10 text-primary' :
                    'bg-secondary/10 text-secondary'
                  }`}>
                    {vendor.risk} risk
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          vendor.reliability >= 90 ? 'bg-secondary' :
                          vendor.reliability >= 80 ? 'bg-primary' :
                          'bg-destructive'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${vendor.reliability}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{vendor.reliability}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last delivery: {vendor.lastDelivery}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          {/* Risk Assessment */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              {riskCategories.map((risk, index) => (
                <motion.div
                  key={risk.type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                >
                  <span className="text-sm text-foreground">{risk.type}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      risk.count === 0 ? 'text-secondary' :
                      risk.count <= 1 ? 'text-primary' :
                      'text-destructive'
                    }`}>
                      {risk.count}
                    </span>
                    <TrendingUp className={`h-3 w-3 ${
                      risk.trend === 'up' ? 'text-destructive' :
                      risk.trend === 'down' ? 'text-secondary rotate-180' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Active Orders */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Orders</h3>
            <div className="space-y-3">
              {activeOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.vendor}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-secondary/10 text-secondary' :
                      order.status === 'in_transit' ? 'bg-primary/10 text-primary' :
                      'bg-muted/30 text-muted-foreground'
                    }`}>
                      {order.status === 'delivered' ? 'Delivered' :
                       order.status === 'in_transit' ? 'In Transit' : 'Processing'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{order.eta}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
