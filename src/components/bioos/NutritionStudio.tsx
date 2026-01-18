import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, ChevronLeft, ChevronRight, Flame, Beef, 
  Wheat, Droplets, ShoppingCart, Sparkles, RefreshCw,
  Clock, Users, ChefHat
} from 'lucide-react';
import { BioCard, BioHeroCard } from './BioCard';
import { BioMetricRing } from './BioMetricRing';
import { Button } from '@/components/ui/button';
import { demoMeals, demoMacroTargets, Meal } from '@/lib/bioOSData';
import { cn } from '@/lib/utils';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mealTypeConfig: Record<string, { color: string; icon: typeof Utensils }> = {
  breakfast: { color: 'from-amber-500 to-orange-600', icon: Utensils },
  lunch: { color: 'from-emerald-500 to-green-600', icon: Utensils },
  dinner: { color: 'from-purple-500 to-pink-600', icon: ChefHat },
  snack: { color: 'from-cyan-500 to-blue-600', icon: Utensils }
};

export function NutritionStudio() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const macros = demoMacroTargets;
  const meals = demoMeals[selectedDay] || [];

  const dayIndex = days.indexOf(selectedDay);
  const prevDay = days[(dayIndex - 1 + 7) % 7];
  const nextDay = days[(dayIndex + 1) % 7];

  return (
    <div className="space-y-6">
      {/* Macro Overview */}
      <BioHeroCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Daily Nutrition</h2>
            <p className="text-muted-foreground">Track your macros and fuel your performance</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-green-600">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <BioMetricRing
            value={macros.calories.current}
            maxValue={macros.calories.target}
            color="amber"
            label="Calories"
            sublabel={`/ ${macros.calories.target}`}
            size="lg"
            icon={<Flame className="w-5 h-5" />}
          />
          <BioMetricRing
            value={macros.protein.current}
            maxValue={macros.protein.target}
            color="red"
            label="Protein"
            sublabel={`/ ${macros.protein.target}g`}
            size="lg"
            icon={<Beef className="w-5 h-5" />}
          />
          <BioMetricRing
            value={macros.carbs.current}
            maxValue={macros.carbs.target}
            color="blue"
            label="Carbs"
            sublabel={`/ ${macros.carbs.target}g`}
            size="lg"
            icon={<Wheat className="w-5 h-5" />}
          />
          <BioMetricRing
            value={macros.fat.current}
            maxValue={macros.fat.target}
            color="purple"
            label="Fat"
            sublabel={`/ ${macros.fat.target}g`}
            size="lg"
            icon={<Droplets className="w-5 h-5" />}
          />
        </div>
      </BioHeroCard>

      {/* Day Selector */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDay(prevDay)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {days.map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedDay === day
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                  : 'bg-white/10 text-muted-foreground hover:bg-white/20'
              )}
            >
              {day.slice(0, 3)}
            </motion.button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDay(nextDay)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Meal Plan */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {meals.map((meal, index) => {
            const config = mealTypeConfig[meal.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <BioCard
                  className="p-5"
                  gradient={config.color}
                  hover
                  onClick={() => setSelectedMeal(meal)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      'p-2 rounded-lg bg-gradient-to-br',
                      config.color
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {meal.time}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize mb-4">{meal.type}</p>

                  {/* Macro breakdown */}
                  <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-white/5">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Cal</p>
                      <p className="font-semibold text-amber-400">{meal.calories}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Pro</p>
                      <p className="font-semibold text-red-400">{meal.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Carb</p>
                      <p className="font-semibold text-blue-400">{meal.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="font-semibold text-purple-400">{meal.fat}g</p>
                    </div>
                  </div>

                  {/* Swap button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Swap Meal
                  </Button>
                </BioCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Meal Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BioCard className="p-5 h-full flex flex-col items-center justify-center border-dashed" hover>
            <div className="p-4 rounded-full bg-white/10 mb-3">
              <Utensils className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Add Meal or Snack</p>
            <p className="text-sm text-muted-foreground">Log your food intake</p>
          </BioCard>
        </motion.div>
      </div>

      {/* Grocery List */}
      <BioCard className="p-6" gradient="from-cyan-500/10 to-blue-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Grocery List</h3>
              <p className="text-sm text-muted-foreground">
                Generated from your meal plan • 24 items
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/20">
              View List
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              Export to Cart
            </Button>
          </div>
        </div>
      </BioCard>

      {/* Meal Detail Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <BioCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedMeal.name}</h2>
                    <p className="text-muted-foreground capitalize">{selectedMeal.type} • {selectedMeal.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMeal(null)}>
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3 p-4 rounded-lg bg-white/5 mb-6">
                  <div className="text-center">
                    <Flame className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                    <p className="font-bold text-foreground">{selectedMeal.calories}</p>
                    <p className="text-xs text-muted-foreground">calories</p>
                  </div>
                  <div className="text-center">
                    <Beef className="w-5 h-5 mx-auto mb-1 text-red-400" />
                    <p className="font-bold text-foreground">{selectedMeal.protein}g</p>
                    <p className="text-xs text-muted-foreground">protein</p>
                  </div>
                  <div className="text-center">
                    <Wheat className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                    <p className="font-bold text-foreground">{selectedMeal.carbs}g</p>
                    <p className="text-xs text-muted-foreground">carbs</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <p className="font-bold text-foreground">{selectedMeal.fat}g</p>
                    <p className="text-xs text-muted-foreground">fat</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Ingredients</h4>
                  <div className="space-y-2">
                    {selectedMeal.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600">
                    Log This Meal
                  </Button>
                  <Button variant="outline" className="border-white/20">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Swap
                  </Button>
                </div>
              </BioCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
