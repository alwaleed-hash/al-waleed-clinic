import { useState, useEffect } from "react";
import OverviewTab from "../components/overview-tab";
import AppointmentsTab from "../components/appointments-tab";
import PatientsTab from "../components/patients-tab";
import DoctorsTab from "../components/doctors-tab";
import Header from "../components/header";

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Handle URL parameter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (
      tabParam &&
      ["overview", "appointments", "patients", "doctors"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "appointments":
        return <AppointmentsTab />;
      case "patients":
        return <PatientsTab />;
      case "doctors":
        return <DoctorsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <Header />

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm">
          {["overview", "appointments", "patients", "doctors"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-3 px-4 text-sm cursor-pointer font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-[#1c3f60] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
