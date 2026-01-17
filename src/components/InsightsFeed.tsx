import { GlassCard } from "./GlassCard";
import { Check, Circle, Settings } from "lucide-react";

interface Insight {
  id: string;
  text: string;
  status: "completed" | "pending" | "new";
  highlight?: boolean;
}

const insights: Insight[] = [
  { id: "1", text: "Sleep Score Low - Schedule Adjusted", status: "completed" },
  { id: "2", text: "Revenue +8% This Week", status: "completed", highlight: true },
  { id: "3", text: "Focus Window Opens in 10 Min", status: "pending" },
  { id: "4", text: "New System Update - Review Available", status: "new" },
];

export function InsightsFeed() {
  return (
    <GlassCard className="p-4 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Insights & Notifications</h3>
        <button className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="space-y-2">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="flex items-start gap-2 p-2 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
          >
            {insight.status === "completed" ? (
              <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            )}
            <span className="text-xs text-muted-foreground leading-relaxed">
              {insight.text}
            </span>
            {insight.highlight && (
              <Check className="h-3.5 w-3.5 text-secondary ml-auto shrink-0" />
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
