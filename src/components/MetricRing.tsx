import { cn } from "@/lib/utils";

interface MetricRingProps {
  label: string;
  value: string | number;
  percentage: number;
  color?: "cyan" | "gold";
  size?: number;
}

export function MetricRing({ 
  label, 
  value, 
  percentage, 
  color = "cyan",
  size = 100
}: MetricRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = color === "gold" 
    ? "stroke-primary" 
    : "stroke-secondary";

  const glowFilter = color === "gold"
    ? "drop-shadow(0 0 10px hsl(40 65% 69% / 0.6))"
    : "drop-shadow(0 0 10px hsl(186 70% 60% / 0.6))";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-foreground/10"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn(colorClasses, "transition-all duration-1000 ease-luxury")}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              filter: glowFilter,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
