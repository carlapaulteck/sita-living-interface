import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { BioCommandCenter } from "@/components/bioos/BioCommandCenter";
import { BioVault } from "@/components/bioos/BioVault";
import { NutritionStudio } from "@/components/bioos/NutritionStudio";
import { TrainingHub } from "@/components/bioos/TrainingHub";
import { RecoveryLab } from "@/components/bioos/RecoveryLab";
import { CoachTeam } from "@/components/bioos/CoachTeam";
import MealPlanGenerator from "@/components/bioos/MealPlanGenerator";
import { HealthRecords } from "@/components/healthcare/HealthRecords";
import { MedicationTracker } from "@/components/healthcare/MedicationTracker";
import { MentalWellness } from "@/components/healthcare/MentalWellness";
import { VaccineScheduler } from "@/components/healthcare/VaccineScheduler";

const TABS = [
  { id: "command", label: "Command Center" },
  { id: "nutrition", label: "Nutrition" },
  { id: "training", label: "Training" },
  { id: "recovery", label: "Recovery" },
  { id: "records", label: "Health Records" },
  { id: "medications", label: "Medications" },
  { id: "mental", label: "Mental Wellness" },
  { id: "coaches", label: "Coach Team" },
];

const HealthFitness = () => {
  const [activeTab, setActiveTab] = useState("command");

  const renderContent = () => {
    switch (activeTab) {
      case "command":
        return (
          <div className="space-y-6">
            <BioCommandCenter />
            <BioVault />
          </div>
        );
      case "nutrition":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NutritionStudio />
            <MealPlanGenerator />
          </div>
        );
      case "training":
        return <TrainingHub />;
      case "recovery":
        return <RecoveryLab />;
      case "records":
        return <HealthRecords />;
      case "medications":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicationTracker />
            <VaccineScheduler />
          </div>
        );
      case "mental":
        return <MentalWellness />;
      case "coaches":
        return <CoachTeam />;
      default:
        return null;
    }
  };

  return (
    <ModuleLayout
      title="Health & Fitness"
      subtitle="Your BIO-OS wellness command center"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
};

export default HealthFitness;
