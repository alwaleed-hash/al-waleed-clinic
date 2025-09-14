import { type Availability, type Doctor, type Patient } from "./types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "available":
      return "bg-green-100 text-green-800";
    case "busy":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getAppointmentStatusBadgeClass = (status: string): string => {
  const baseClasses =
    "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";

  switch (status?.toLowerCase()) {
    case "active":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "visited":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "survey_sent":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "cancelled":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "completed":
      return `${baseClasses} bg-emerald-100 text-emerald-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// export const formatDate = (booking: Booking): string => {
//   if (booking.date) return booking.date;
//   if (booking.time) {
//     return new Date(booking.time).toLocaleDateString();
//   }
//   return "N/A";
// };

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};

export const formatAvailability = (availability: Availability): string => {
  const days = availability.days
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3))
    .join(", ");

  const startTime = formatTime(availability.start_time);
  const endTime = formatTime(availability.end_time);

  return `${days} • ${startTime} - ${endTime}`;
};

export const isAvailableToday = (doctor: Doctor): boolean => {
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  return doctor.availability.days.includes(today);
};

export const getAppointmentStatus = (
  patient: Patient
): {
  message: string;
  type: "normal" | "warning" | "urgent";
  daysSince: number | null;
} => {
  if (
    !patient.last_appointment_date ||
    patient.last_appointment_date === "null"
  ) {
    return {
      message: "No previous appointments",
      type: "normal",
      daysSince: null,
    };
  }

  try {
    // Parse the date format "September 06, 2025"
    const lastAppointment = new Date(patient.last_appointment_date);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - lastAppointment.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays >= 40) {
      return {
        message: `No booking since ${diffInDays} days`,
        type: "urgent",
        daysSince: diffInDays,
      };
    } else if (diffInDays >= 30) {
      return {
        message: `No booking for ${diffInDays} days`,
        type: "warning",
        daysSince: diffInDays,
      };
    } else {
      return {
        message: "Recent appointment",
        type: "normal",
        daysSince: diffInDays,
      };
    }
  } catch {
    return {
      message: "Invalid date",
      type: "normal",
      daysSince: null,
    };
  }
};

export const getPatientStatusBadgeClass = (
  type: "normal" | "warning" | "urgent"
): string => {
  switch (type) {
    case "warning":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "urgent":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "";
  }
};
