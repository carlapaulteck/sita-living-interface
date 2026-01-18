import { motion } from "framer-motion";
import { Heart, Calendar, Pill, AlertTriangle, Check } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SignalCard } from "@/components/SignalCard";

interface Pet {
  id: string;
  name: string;
  type: string;
  nextVet: string;
  lastFed: string;
}

const PETS: Pet[] = [
  { id: "1", name: "Max", type: "Golden Retriever", nextVet: "March 15", lastFed: "2 hours ago" },
];

const CARE_TASKS = [
  { id: "1", task: "Morning Walk", time: "7:00 AM", done: true },
  { id: "2", task: "Breakfast", time: "7:30 AM", done: true },
  { id: "3", task: "Evening Walk", time: "5:00 PM", done: false },
  { id: "4", task: "Dinner", time: "6:00 PM", done: false },
];

export function PetCare() {
  return (
    <div className="space-y-6">
      {/* Pet Overview Cards */}
      {PETS.map((pet) => (
        <GlassCard key={pet.id} className="p-6" hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-medium text-foreground">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SignalCard
              title="Health"
              value="Excellent"
              icon={Heart}
              status="healthy"
            />
            <SignalCard
              title="Next Vet"
              value={pet.nextVet}
              icon={Calendar}
              status="attention"
            />
            <SignalCard
              title="Medications"
              value="Up to date"
              icon={Pill}
              status="healthy"
            />
            <SignalCard
              title="Vaccines"
              value="Current"
              icon={Check}
              status="healthy"
            />
          </div>
        </GlassCard>
      ))}

      {/* Daily Care Checklist */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Today's Care Tasks</h3>
        <div className="space-y-3">
          {CARE_TASKS.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                task.done
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-card/50 border-border/50 hover:border-primary/30"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                task.done ? "border-emerald-500 bg-emerald-500/20" : "border-muted-foreground"
              }`}>
                {task.done && <Check className="h-4 w-4 text-emerald-400" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {task.task}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">{task.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Supplies Alert */}
      <GlassCard className="p-4 bg-amber-500/5 border-amber-500/20" hover={false}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Dog Food Running Low</p>
            <p className="text-xs text-muted-foreground">~3 days remaining • Reorder suggested</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors">
            Reorder
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
