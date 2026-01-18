import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { FamilyHub } from "@/components/family/FamilyHub";
import { FamilyCalendar } from "@/components/family/FamilyCalendar";
import { ResponsibilityMatrix } from "@/components/family/ResponsibilityMatrix";
import { FamilyPreferences } from "@/components/family/FamilyPreferences";
import { PetCare } from "@/components/family/PetCare";

const TABS = [
  { id: "hub", label: "Family Hub" },
  { id: "calendar", label: "Calendar" },
  { id: "responsibilities", label: "Responsibilities" },
  { id: "preferences", label: "Preferences" },
  { id: "pets", label: "Pet Care" },
];

export default function Family() {
  const [activeTab, setActiveTab] = useState("hub");

  const renderContent = () => {
    switch (activeTab) {
      case "hub":
        return <FamilyHub />;
      case "calendar":
        return <FamilyCalendar />;
      case "responsibilities":
        return <ResponsibilityMatrix />;
      case "preferences":
        return <FamilyPreferences />;
      case "pets":
        return <PetCare />;
      default:
        return <FamilyHub />;
    }
  };

  return (
    <ModuleLayout
      title="Family Hub"
      subtitle="Household coordination and care"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
