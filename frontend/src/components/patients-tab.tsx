import React, { useEffect, useState } from "react";
import { Calendar, Phone } from "lucide-react";
import Loader from "./loader";
import { type Patient, type PatientsApiResponse } from "../lib/types";
import { getAppointmentStatus, getPatientStatusBadgeClass } from "../lib/utils";

const PatientsTab: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/patients`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data: PatientsApiResponse = await response.json();
        setPatients(data.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getPatientInitials = (phoneNumber: string): string => {
    // Extract last 2 digits of phone number for display
    return phoneNumber.slice(-2);
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Patients
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
        </div>
      </div>

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No patients found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border ${(() => {
                const status = getAppointmentStatus(patient);
                if (status.type === "urgent") return "border-red-300 bg-red-50";
                if (status.type === "warning")
                  return "border-yellow-300 bg-yellow-50";
                return "border-gray-300";
              })()}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-[#1c3f60] font-semibold text-sm">
                      {getPatientInitials(patient.phone_number)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {patient.serial_code || "New Patient"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ID: {patient._id.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    {patient.phone_number}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <div className="flex flex-col space-y-1">
                      <span>
                        Last visit: {patient.last_appointment_date || "Never"}
                      </span>
                      {(() => {
                        const status = getAppointmentStatus(patient);
                        return status.type !== "normal" ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getPatientStatusBadgeClass(
                              status.type
                            )}`}
                          >
                            {status.message}
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {patient.active_appointments || 0}
                  </div>
                  <div className="text-xs text-[#1c3f60]">Active</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsTab;
