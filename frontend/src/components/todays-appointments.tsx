import React, { useEffect, useState } from "react";
import Loader from "./loader";
import { getAppointmentStatusBadgeClass } from "../lib/utils";
import { type Booking, type BookingsApiResponse } from "../lib/types";

const TodayAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/today`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch today's appointments");
        }

        const data: BookingsApiResponse = await response.json();
        setAppointments(data.data || []);
      } catch (err) {
        console.error("Error fetching today's appointments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

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
            Error Loading Appointments
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Today's Appointments
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {appointments.length}{" "}
              {appointments.length === 1 ? "appointment" : "appointments"}{" "}
              scheduled
            </p>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No appointments today
            </h3>
            <p className="text-gray-500">
              Enjoy your free day! No appointments are scheduled for today.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Left side - Main info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Time */}
                      <div className="flex-shrink-0">
                        <div className="bg-blue-100 text-[#1c3f60] px-3 py-2 rounded-lg font-mono text-sm font-medium">
                          {appointment.time}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {appointment.patient_name}
                        </h3>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Doctor:</span>
                            <span>
                              {appointment.doctor_name || "Not assigned"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right side - Status */}
                  <div className="flex-shrink-0">
                    <span
                      className={getAppointmentStatusBadgeClass(
                        appointment.status
                      )}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
