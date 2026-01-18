import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, TrendingUp, TrendingDown, Minus,
  FlaskConical, Scan, Stethoscope, ChevronRight, Check,
  AlertCircle, Clock, Filter
} from 'lucide-react';
import { BioCard } from './BioCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { demoLabResults, demoDocuments, LabResult, HealthDocument } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const documentTypeConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  lab_report: { icon: FlaskConical, color: 'from-cyan-500 to-blue-600', label: 'Lab Report' },
  imaging: { icon: Scan, color: 'from-purple-500 to-pink-600', label: 'Imaging' },
  visit: { icon: Stethoscope, color: 'from-amber-500 to-orange-600', label: 'Visit' },
  other: { icon: FileText, color: 'from-gray-500 to-slate-600', label: 'Other' }
};

const statusConfig: Record<string, { color: string; label: string }> = {
  processed: { color: 'text-emerald-400 bg-emerald-500/20', label: 'Processed' },
  processing: { color: 'text-amber-400 bg-amber-500/20', label: 'Processing' },
  needs_review: { color: 'text-red-400 bg-red-500/20', label: 'Needs Review' }
};

function getValueStatus(result: LabResult): 'normal' | 'low' | 'high' {
  if (result.value < result.refLow) return 'low';
  if (result.value > result.refHigh) return 'high';
  return 'normal';
}

function getTrend(current: number, previous?: number): 'up' | 'down' | 'stable' {
  if (!previous) return 'stable';
  const diff = ((current - previous) / previous) * 100;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

export function BioVault() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<HealthDocument | null>(null);

  const categories = ['all', ...new Set(demoLabResults.map(r => r.category))];

  const filteredResults = selectedCategory === 'all' 
    ? demoLabResults 
    : demoLabResults.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <BioCard className="p-6" gradient="from-purple-500/10 to-pink-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Upload Health Records</h3>
              <p className="text-sm text-muted-foreground">
                Lab reports, imaging, visit summaries, and more
              </p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </BioCard>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="results">Lab Results</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                )}
              >
                {cat === 'all' ? 'All Results' : cat}
              </motion.button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredResults.map((result, index) => {
                const status = getValueStatus(result);
                const trend = getTrend(result.value, result.previousValue);
                
                return (
                  <motion.div
                    key={result.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BioCard className="p-4" hover>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{result.analyte}</h4>
                          <p className="text-xs text-muted-foreground">{result.category}</p>
                        </div>
                        <div className={cn(
                          'flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                          status === 'normal' ? 'bg-emerald-500/20 text-emerald-400' :
                          status === 'low' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          {status === 'normal' ? <Check className="w-3 h-3" /> :
                           <AlertCircle className="w-3 h-3" />}
                          {status}
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className={cn(
                              'text-2xl font-bold',
                              status === 'normal' ? 'text-foreground' :
                              status === 'low' ? 'text-blue-400' : 'text-red-400'
                            )}>
                              {result.value}
                            </span>
                            <span className="text-sm text-muted-foreground">{result.unit}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ref: {result.refLow} - {result.refHigh}
                          </p>
                        </div>

                        {result.previousValue && (
                          <div className={cn(
                            'flex items-center gap-1 text-sm',
                            trend === 'up' ? 'text-red-400' :
                            trend === 'down' ? 'text-emerald-400' : 'text-muted-foreground'
                          )}>
                            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                             trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                             <Minus className="w-4 h-4" />}
                            <span>
                              {trend === 'stable' ? 'Stable' :
                               `${Math.abs(((result.value - result.previousValue) / result.previousValue) * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        )}
                      </div>
                    </BioCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          {/* Timeline View */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500" />

            {demoDocuments.map((doc, index) => {
              const config = documentTypeConfig[doc.type];
              const Icon = config.icon;
              const status = statusConfig[doc.status];

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16 pb-6"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    'absolute left-3 w-6 h-6 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br',
                    config.color
                  )}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>

                  <BioCard 
                    className="p-4" 
                    hover 
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{doc.title}</h4>
                          <span className={cn('px-2 py-0.5 rounded-full text-xs', status.color)}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{format(new Date(doc.date), 'MMM d, yyyy')}</span>
                          {doc.provider && (
                            <>
                              <span>•</span>
                              <span>{doc.provider}</span>
                            </>
                          )}
                        </div>
                        {doc.summary && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {doc.summary}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </BioCard>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          {/* Comparison View */}
          <BioCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Panel Comparison</h3>
            <p className="text-muted-foreground mb-6">
              Compare your lab results across different dates
            </p>

            <div className="grid gap-4">
              {demoLabResults.filter(r => r.previousValue).slice(0, 5).map((result) => {
                const change = result.previousValue 
                  ? ((result.value - result.previousValue) / result.previousValue) * 100 
                  : 0;
                const isImproved = result.analyte.includes('HDL') ? change > 0 : change < 0;

                return (
                  <div key={result.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{result.analyte}</p>
                      <p className="text-sm text-muted-foreground">{result.category}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm text-muted-foreground">Previous</p>
                      <p className="font-medium text-foreground">{result.previousValue}</p>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 px-3 py-1 rounded-full',
                      isImproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    )}>
                      {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="font-medium text-cyan-400">{result.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </BioCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
