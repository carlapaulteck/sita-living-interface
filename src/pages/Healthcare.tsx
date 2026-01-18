import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { HealthRecords } from "@/components/healthcare/HealthRecords";
import { MedicationTracker } from "@/components/healthcare/MedicationTracker";
import { VaccineScheduler } from "@/components/healthcare/VaccineScheduler";
import { MentalWellness } from "@/components/healthcare/MentalWellness";

const TABS = [
  { id: "records", label: "Health Records" },
  { id: "medications", label: "Medications" },
  { id: "vaccines", label: "Vaccines" },
  { id: "mental", label: "Mental Wellness" },
];

export default function Healthcare() {
  const [activeTab, setActiveTab] = useState("records");

  const renderContent = () => {
    switch (activeTab) {
      case "records":
        return <HealthRecords />;
      case "medications":
        return <MedicationTracker />;
      case "vaccines":
        return <VaccineScheduler />;
      case "mental":
        return <MentalWellness />;
      default:
        return <HealthRecords />;
    }
  };

  return (
    <ModuleLayout
      title="Healthcare"
      subtitle="Medical records and wellness management"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
