export interface Booking {
  _id: string;
  doctor_id: string;
  patient_id?: string;
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
  time?: string;
  day?: string;
  doctor_name?: string;
  patient_name: string;
  date?: string;
  status: string;
  event_id?: string;
  rating?: number | null;
  comments?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface BookingsApiResponse {
  success: boolean;
  count: number;
  data: Booking[];
}

export interface RecentMessage {
  message_id: string;
  type: "incoming" | "outgoing";
  text: string;
  timestamp: string | Date;
}

export interface Patient {
  _id: string;
  phone_number: string;
  serial_code?: string | null;
  last_appointment_date?: string | null;
  last_appointment_day?: string | null;
  next_eligible_date?: string | null;
  total_appointments: number;
  active_appointments: number;
  recent_messages: RecentMessage[];
  last_message_time: string | Date;
}

export interface PatientsApiResponse {
  success: boolean;
  count: number;
  data: Patient[];
}

export interface Availability {
  days: string[];
  start_time: string;
  end_time: string;
  last_booking_time: string;
}

export interface Doctor {
  _id: string;
  name: string;
  color: string;
  availability: Availability;
  max_appointments_per_hour: number;
  status: "active" | "inactive";
  created_at: string | Date;
  updated_at: string | Date;
}

export interface DoctorsApiResponse {
  success: boolean;
  count: number;
  data: Doctor[];
}
