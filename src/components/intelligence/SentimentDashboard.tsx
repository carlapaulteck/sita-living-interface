import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Smile, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sentimentTrend = [
  { date: "Jan 1", positive: 72, neutral: 20, negative: 8 },
  { date: "Jan 5", positive: 68, neutral: 22, negative: 10 },
  { date: "Jan 10", positive: 75, neutral: 18, negative: 7 },
  { date: "Jan 15", positive: 78, neutral: 16, negative: 6 },
  { date: "Jan 18", positive: 82, neutral: 13, negative: 5 },
];

const channelBreakdown = [
  { channel: "Social Media", sentiment: 84, volume: 1250, trend: "up" },
  { channel: "Reviews", sentiment: 78, volume: 342, trend: "stable" },
  { channel: "Support Tickets", sentiment: 65, volume: 89, trend: "down" },
  { channel: "Email Feedback", sentiment: 88, volume: 156, trend: "up" },
];

const recentMentions = [
  { source: "Twitter", text: "Amazing customer service from @YourBrand!", sentiment: "positive", time: "2h ago" },
  { source: "Google Reviews", text: "Product quality has improved significantly", sentiment: "positive", time: "5h ago" },
  { source: "Support", text: "Issue with order #12345 not resolved yet", sentiment: "negative", time: "1d ago" },
  { source: "Facebook", text: "Great new features in the latest update", sentiment: "positive", time: "1d ago" },
];

export function SentimentDashboard() {
  const overallSentiment = 82;
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Overall Sentiment"
          value={`${overallSentiment}%`}
          subtitle="Positive"
          icon={Smile}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Positive Mentions"
          value="1,847"
          subtitle="+12% this week"
          icon={ThumbsUp}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Negative Mentions"
          value="142"
          subtitle="-8% this week"
          icon={ThumbsDown}
          status="healthy"
          trend="down"
        />
        <MetricSignalCard
          title="Total Volume"
          value="2,245"
          subtitle="Mentions tracked"
          icon={MessageSquare}
          status="neutral"
        />
      </div>

      {/* Sentiment Trend */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sentiment Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentTrend}>
              <defs>
                <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" fillOpacity={1} fill="url(#positiveGrad)" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#negativeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">By Channel</h3>
          <div className="space-y-4">
            {channelBreakdown.map((channel, index) => (
              <motion.div
                key={channel.channel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{channel.channel}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      channel.sentiment >= 80 ? 'text-secondary' :
                      channel.sentiment >= 60 ? 'text-primary' :
                      'text-destructive'
                    }`}>
                      {channel.sentiment}%
                    </span>
                    <TrendingUp className={`h-3 w-3 ${
                      channel.trend === 'up' ? 'text-secondary' :
                      channel.trend === 'down' ? 'text-destructive rotate-180' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      channel.sentiment >= 80 ? 'bg-secondary' :
                      channel.sentiment >= 60 ? 'bg-primary' :
                      'bg-destructive'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${channel.sentiment}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{channel.volume} mentions</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Mentions */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Mentions</h3>
          <div className="space-y-3">
            {recentMentions.map((mention, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl ${
                  mention.sentiment === 'positive' ? 'bg-secondary/5 border border-secondary/20' :
                  mention.sentiment === 'negative' ? 'bg-destructive/5 border border-destructive/20' :
                  'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{mention.source}</span>
                  <span className="text-xs text-muted-foreground">{mention.time}</span>
                </div>
                <p className="text-sm text-foreground">{mention.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
