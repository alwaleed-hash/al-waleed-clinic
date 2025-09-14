import { type Availability, type Doctor } from "./types";

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

export const getStatusBadgeClass = (status: string): string => {
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
