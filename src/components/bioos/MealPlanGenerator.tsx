import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Target, Flame, Dumbbell, Heart, ChefHat, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useBioOS } from '@/hooks/useBioOS';
import { BioCard } from './BioCard';

const goals = [
  { value: 'lose_weight', label: 'Lose Weight', icon: Flame, color: 'text-orange-400' },
  { value: 'build_muscle', label: 'Build Muscle', icon: Dumbbell, color: 'text-blue-400' },
  { value: 'maintain', label: 'Maintain', icon: Target, color: 'text-green-400' },
  { value: 'improve_endurance', label: 'Improve Endurance', icon: Heart, color: 'text-rose-400' },
];

const dietTypes = [
  { value: 'standard', label: 'Standard' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const commonAllergies = ['Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Shellfish', 'Fish'];

interface MealPlanGeneratorProps {
  onClose?: () => void;
}

export default function MealPlanGenerator({ onClose }: MealPlanGeneratorProps) {
  const { bioProfile, updateBioProfile, generateMealPlan } = useBioOS();
  
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(bioProfile?.fitness_goal || 'maintain');
  const [dietType, setDietType] = useState(bioProfile?.diet_type || 'standard');
  const [allergies, setAllergies] = useState<string[]>(bioProfile?.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [proteinGrams, setProteinGrams] = useState(150);
  const [carbsGrams, setCarbsGrams] = useState(200);
  const [fatGrams, setFatGrams] = useState(70);

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomAllergy = () => {
    if (customAllergy && !allergies.includes(customAllergy)) {
      setAllergies(prev => [...prev, customAllergy]);
      setCustomAllergy('');
    }
  };

  const handleGenerate = async () => {
    // Save profile updates
    await updateBioProfile.mutateAsync({
      fitness_goal: goal,
      diet_type: dietType,
      allergies,
    });

    // Generate meal plan
    await generateMealPlan.mutateAsync({
      goal,
      durationDays,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
    });

    onClose?.();
  };

  const isGenerating = generateMealPlan.isPending;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`w-3 h-3 rounded-full ${
              s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-muted'
            }`}
            animate={{ scale: s === step ? 1.2 : 1 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">What's your goal?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                We'll optimize your meal plan accordingly
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = goal === g.value;
                return (
                  <motion.button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${g.color}`} />
                    <span className="text-sm font-medium">{g.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="space-y-3">
              <Label>Diet Type</Label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietTypes.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Any allergies or restrictions?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Select all that apply
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {commonAllergies.map((allergy) => (
                <Badge
                  key={allergy}
                  variant={allergies.includes(allergy) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAllergy(allergy)}
                >
                  {allergies.includes(allergy) && <AlertCircle className="w-3 h-3 mr-1" />}
                  {allergy}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom allergy..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomAllergy()}
              />
              <Button variant="outline" onClick={addCustomAllergy}>Add</Button>
            </div>

            {allergies.filter(a => !commonAllergies.includes(a)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.filter(a => !commonAllergies.includes(a)).map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => toggleAllergy(allergy)}
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {allergy}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Set your targets</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Customize your daily nutrition goals
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Plan Duration</Label>
                  <span className="text-sm text-muted-foreground">{durationDays} days</span>
                </div>
                <Slider
                  value={[durationDays]}
                  onValueChange={([v]) => setDurationDays(v)}
                  min={3}
                  max={14}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Daily Calories</Label>
                  <span className="text-sm text-muted-foreground">{dailyCalories} kcal</span>
                </div>
                <Slider
                  value={[dailyCalories]}
                  onValueChange={([v]) => setDailyCalories(v)}
                  min={1200}
                  max={4000}
                  step={50}
                />
              </div>

              <BioCard className="p-4">
                <h4 className="text-sm font-medium mb-3">Macro Split</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyan-400">Protein</span>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[proteinGrams]}
                        onValueChange={([v]) => setProteinGrams(v)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm w-12 text-right">{proteinGrams}g</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-400">Carbs</span>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[carbsGrams]}
                        onValueChange={([v]) => setCarbsGrams(v)}
                        min={50}
                        max={400}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm w-12 text-right">{carbsGrams}g</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rose-400">Fat</span>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[fatGrams]}
                        onValueChange={([v]) => setFatGrams(v)}
                        min={20}
                        max={200}
                        step={5}
                        className="w-32"
                      />
                      <span className="text-sm w-12 text-right">{fatGrams}g</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Calculated Calories</span>
                    <span className="font-medium">
                      {proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9} kcal
                    </span>
                  </div>
                </div>
              </BioCard>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleGenerate} 
                className="flex-1 gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
