import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Store,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ExternalLink,
  Archive,
  Play,
  Pause,
  Target,
  Users,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";

interface MicrobrandsPortfolioProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Microbrand {
  id: string;
  name: string;
  niche: string;
  status: "active" | "scaling" | "archived";
  monthlyRevenue: number;
  growthRate: number;
  profitMargin: number;
  customers: number;
  channels: string[];
}

const microbrands: Microbrand[] = [
  {
    id: "1",
    name: "AURORA Skin",
    niche: "Skincare DTC",
    status: "scaling",
    monthlyRevenue: 24500,
    growthRate: 18.5,
    profitMargin: 42,
    customers: 1240,
    channels: ["Shopify", "Instagram", "TikTok"],
  },
  {
    id: "2",
    name: "Peak Performance Gear",
    niche: "Fitness Accessories",
    status: "active",
    monthlyRevenue: 8200,
    growthRate: 7.2,
    profitMargin: 35,
    customers: 420,
    channels: ["Amazon", "Shopify"],
  },
  {
    id: "3",
    name: "Mindful Mornings",
    niche: "Wellness Supplements",
    status: "active",
    monthlyRevenue: 12800,
    growthRate: 12.1,
    profitMargin: 48,
    customers: 680,
    channels: ["Shopify", "Subscription"],
  },
  {
    id: "4",
    name: "Urban Essentials",
    niche: "EDC Accessories",
    status: "archived",
    monthlyRevenue: 2100,
    growthRate: -5.2,
    profitMargin: 22,
    customers: 180,
    channels: ["Etsy"],
  },
];

export function MicrobrandsPortfolio({ isOpen, onClose }: MicrobrandsPortfolioProps) {
  const [activeTab, setActiveTab] = useState("active");

  if (!isOpen) return null;

  const getStatusColor = (status: Microbrand["status"]) => {
    switch (status) {
      case "active": return "bg-primary/20 text-primary";
      case "scaling": return "bg-secondary/20 text-secondary";
      case "archived": return "bg-muted text-muted-foreground";
    }
  };

  const totalRevenue = microbrands
    .filter(b => b.status !== "archived")
    .reduce((sum, b) => sum + b.monthlyRevenue, 0);

  const totalCustomers = microbrands
    .filter(b => b.status !== "archived")
    .reduce((sum, b) => sum + b.customers, 0);

  const avgGrowth = microbrands
    .filter(b => b.status !== "archived")
    .reduce((sum, b) => sum + b.growthRate, 0) / 
    microbrands.filter(b => b.status !== "archived").length;

  const filteredBrands = activeTab === "all" 
    ? microbrands 
    : microbrands.filter(b => b.status === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[85vh] overflow-hidden"
      >
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/20">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-display font-medium text-foreground">
                Microbrands Portfolio
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Your empire of autonomous digital assets.
            </p>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Monthly Revenue</span>
              </div>
              <p className="text-2xl font-display font-semibold text-foreground">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Avg. Growth</span>
              </div>
              <p className="text-2xl font-display font-semibold text-secondary flex items-center gap-1">
                +{avgGrowth.toFixed(1)}%
                <ArrowUpRight className="h-4 w-4" />
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Total Customers</span>
              </div>
              <p className="text-2xl font-display font-semibold text-foreground">
                {totalCustomers.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-foreground/5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs">Active Brands</span>
              </div>
              <p className="text-2xl font-display font-semibold text-foreground">
                {microbrands.filter(b => b.status !== "archived").length}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scaling">Scaling</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <div className="max-h-[45vh] overflow-y-auto pr-2 space-y-3">
              <AnimatePresence mode="wait">
                {filteredBrands.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No brands in this category
                  </motion.div>
                ) : (
                  filteredBrands.map((brand, index) => (
                    <motion.div
                      key={brand.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                            <Store className="h-6 w-6 text-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{brand.name}</h4>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getStatusColor(brand.status)}`}
                              >
                                {brand.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{brand.niche}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {brand.channels.map(channel => (
                                <span 
                                  key={channel}
                                  className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground"
                                >
                                  {channel}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-display font-semibold text-foreground">
                            ${brand.monthlyRevenue.toLocaleString()}
                          </p>
                          <p className={`text-sm flex items-center justify-end gap-1 ${
                            brand.growthRate >= 0 ? "text-secondary" : "text-destructive"
                          }`}>
                            {brand.growthRate >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(brand.growthRate)}%
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {brand.profitMargin}% margin
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/30">
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          <BarChart3 className="h-3 w-3" />
                          Analytics
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Visit Store
                        </Button>
                        {brand.status !== "archived" && (
                          <Button variant="ghost" size="sm" className="text-xs gap-1">
                            {brand.status === "scaling" ? (
                              <>
                                <Pause className="h-3 w-3" />
                                Pause Scaling
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                Scale Up
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Tabs>

          {/* Exit Readiness */}
          <div className="mt-6 p-4 rounded-xl bg-foreground/5 border border-primary/20 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm text-foreground">Exit Readiness</p>
                  <p className="text-xs text-muted-foreground">
                    Portfolio valuation: ~${Math.round(totalRevenue * 36 / 1000)}K
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Building Value
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
