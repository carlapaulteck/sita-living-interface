import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, FlaskConical, Utensils, Dumbbell, 
  Moon, Users
} from 'lucide-react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { BioCommandCenter } from '@/components/bioos/BioCommandCenter';
import { BioVault } from '@/components/bioos/BioVault';
import { NutritionStudio } from '@/components/bioos/NutritionStudio';
import { TrainingHub } from '@/components/bioos/TrainingHub';
import { RecoveryLab } from '@/components/bioos/RecoveryLab';
import { CoachTeam } from '@/components/bioos/CoachTeam';

const tabs = [
  { id: 'command', label: 'Command Center' },
  { id: 'vault', label: 'Bio Vault' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'training', label: 'Training' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'coach', label: 'Coach Team' }
];

export default function BioOS() {
  const [activeTab, setActiveTab] = useState('command');

  const renderContent = () => {
    switch (activeTab) {
      case 'command':
        return <BioCommandCenter />;
      case 'vault':
        return <BioVault />;
      case 'nutrition':
        return <NutritionStudio />;
      case 'training':
        return <TrainingHub />;
      case 'recovery':
        return <RecoveryLab />;
      case 'coach':
        return <CoachTeam />;
      default:
        return <BioCommandCenter />;
    }
  };

  return (
    <ModuleLayout
      title="BIO-OS"
      subtitle="Your complete health & fitness command center"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </ModuleLayout>
  );
}
