import React, { useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import Loader from "./loader";
import { type Doctor, type DoctorsApiResponse } from "../lib/types";
import { formatAvailability, isAvailableToday } from "../lib/utils";

const DoctorsTab: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/doctors`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data: DoctorsApiResponse = await response.json();
        setDoctors(data.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const getStatusBadgeClass = (status: string): string => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide";

    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "busy":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getDoctorInitials = (name: string): string => {
    const match = name.match(/Dr\.\s*(\w)/i);
    return match ? match[1].toUpperCase() : name.charAt(0).toUpperCase();
  };

  const getCurrentDay = (): string => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
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
            Error Loading Doctors
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
          <h2 className="text-2xl font-bold text-gray-900">Doctors</h2>
        </div>
      </div>

      {/* Today's Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Calendar className="text-[#1c3f60]" size={20} />
          <span className="text-[#1c3f60] font-medium">
            Today is {getCurrentDay()} •{" "}
            {doctors.filter(isAvailableToday).length} doctors available
          </span>
        </div>
      </div>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No doctors found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 ${
                isAvailableToday(doctor)
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: doctor.color || "#eb4034" }}
                >
                  {getDoctorInitials(doctor.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {doctor.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={getStatusBadgeClass(doctor.status)}>
                      {doctor.status}
                    </span>
                    {isAvailableToday(doctor) && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Available Today
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2 text-sm">
                  <Clock className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-900 font-medium">Schedule</div>
                    <div className="text-gray-600">
                      {formatAvailability(doctor.availability)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Users className="text-gray-400" size={16} />
                  <span className="text-gray-600">
                    Max {doctor.max_appointments_per_hour} appointments/hour
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsTab;
