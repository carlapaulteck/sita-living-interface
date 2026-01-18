import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Heart, Brain, Dumbbell, Utensils, 
  Moon, Users, FlaskConical
} from 'lucide-react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BioCommandCenter } from '@/components/bioos/BioCommandCenter';
import { BioVault } from '@/components/bioos/BioVault';
import { NutritionStudio } from '@/components/bioos/NutritionStudio';
import { TrainingHub } from '@/components/bioos/TrainingHub';
import { RecoveryLab } from '@/components/bioos/RecoveryLab';
import { CoachTeam } from '@/components/bioos/CoachTeam';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'command', label: 'Command Center', icon: Activity },
  { id: 'vault', label: 'Bio Vault', icon: FlaskConical },
  { id: 'nutrition', label: 'Nutrition', icon: Utensils },
  { id: 'training', label: 'Training', icon: Dumbbell },
  { id: 'recovery', label: 'Recovery', icon: Moon },
  { id: 'coach', label: 'Coach Team', icon: Users }
];

export default function BioOS() {
  const [activeTab, setActiveTab] = useState('command');

  return (
    <ModuleLayout
      title="BIO-OS"
      subtitle="Your complete health & fitness command center"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Custom Tab Navigation */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-white/5 border border-white/10 p-1 inline-flex w-auto min-w-full lg:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 transition-all',
                    'data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600',
                    'data-[state=active]:text-white data-[state=active]:shadow-lg'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="command" className="mt-0">
            <BioCommandCenter />
          </TabsContent>

          <TabsContent value="vault" className="mt-0">
            <BioVault />
          </TabsContent>

          <TabsContent value="nutrition" className="mt-0">
            <NutritionStudio />
          </TabsContent>

          <TabsContent value="training" className="mt-0">
            <TrainingHub />
          </TabsContent>

          <TabsContent value="recovery" className="mt-0">
            <RecoveryLab />
          </TabsContent>

          <TabsContent value="coach" className="mt-0">
            <CoachTeam />
          </TabsContent>
        </motion.div>
      </Tabs>
    </ModuleLayout>
  );
}
