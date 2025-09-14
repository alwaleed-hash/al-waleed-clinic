import { Router } from "express";
import { getDb } from "../utils/db.js";

const router = Router();

// GET /api/doctors - Get all doctors
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");
    const doctors = await doctorsCollection.find({}).toArray();

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    res.status(500).json({
      error: "Failed to fetch doctors",
      details: error.message,
    });
  }
});

// GET /api/doctors/active - Get active doctors only
router.get("/active", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");

    const activeDoctors = await doctorsCollection
      .find({
        status: "active",
      })
      .toArray();

    res.status(200).json({
      success: true,
      count: activeDoctors.length,
      data: activeDoctors,
    });
  } catch (error) {
    console.error("❌ Error fetching active doctors:", error);
    res.status(500).json({
      error: "Failed to fetch active doctors",
      details: error.message,
    });
  }
});

// GET /api/doctors/available-today - Get doctors available today
router.get("/available-today", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");

    // Get current day of week
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const availableDoctors = await doctorsCollection
      .find({
        status: "active",
        "availability.days": today,
      })
      .toArray();

    res.status(200).json({
      success: true,
      day: today,
      count: availableDoctors.length,
      data: availableDoctors,
    });
  } catch (error) {
    console.error("❌ Error fetching available doctors:", error);
    res.status(500).json({
      error: "Failed to fetch available doctors",
      details: error.message,
    });
  }
});

// GET /api/doctors/search/:query - Search doctors by name
router.get("/search/:query", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");
    const { query } = req.params;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: "Search query must be at least 2 characters long",
      });
    }

    // Create search regex for partial matching
    const searchRegex = new RegExp(query.trim(), "i");

    const doctors = await doctorsCollection
      .find({
        name: searchRegex,
      })
      .toArray();

    res.status(200).json({
      success: true,
      query: query.trim(),
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("❌ Error searching doctors:", error);
    res.status(500).json({
      error: "Failed to search doctors",
      details: error.message,
    });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Try to find by ObjectId or string ID
    let doctor;
    try {
      const { ObjectId } = await import("mongodb");
      doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
    } catch (objectIdError) {
      // If ObjectId fails, try as string
      doctor = await doctorsCollection.findOne({ _id: id });
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
        doctor_id: id,
      });
    }

    res.status(200).json({
      success: true,
      doctor_id: id,
      data: doctor,
    });
  } catch (error) {
    console.error("❌ Error fetching doctor by ID:", error);
    res.status(500).json({
      error: "Failed to fetch doctor by ID",
      details: error.message,
    });
  }
});

// GET /api/doctors/:id/appointments/today - Get today's appointments for a specific doctor
router.get("/:id/appointments/today", async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Get today's date
    const today = new Date();
    const todayFormatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  
    // Find appointments for this doctor today
    const appointments = await bookingsCollection
      .find({
        doctor_id: id,
        date: todayFormatted,
      })
      .sort({ time: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      doctor_id: id,
      date: todayFormatted,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("❌ Error fetching doctor appointments:", error);
    res.status(500).json({
      error: "Failed to fetch doctor appointments",
      details: error.message,
    });
  }
});

// POST /api/doctors - Create a new doctor (for testing)
router.post("/", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");

    const newDoctor = {
      ...req.body,
      status: req.body.status || "active",
      max_appointments_per_hour: req.body.max_appointments_per_hour || 3,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await doctorsCollection.insertOne(newDoctor);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor_id: result.insertedId,
      data: newDoctor,
    });
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
    res.status(500).json({
      error: "Failed to create doctor",
      details: error.message,
    });
  }
});

// GET /api/doctors/stats/summary - Get doctor statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const db = getDb();
    const doctorsCollection = db.collection("doctors");
    const bookingsCollection = db.collection("bookings");

    // Get total doctors
    const totalDoctors = await doctorsCollection.countDocuments();

    // Get active doctors
    const activeDoctors = await doctorsCollection.countDocuments({
      status: "active",
    });

    // Get current day
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Get doctors available today
    const availableToday = await doctorsCollection.countDocuments({
      status: "active",
      "availability.days": today,
    });

    // Get today's appointment count
    const todayFormatted = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    const todayAppointments = await bookingsCollection.countDocuments({
      date: todayFormatted,
    });

    const stats = {
      total_doctors: totalDoctors,
      active_doctors: activeDoctors,
      available_today: availableToday,
      today_appointments: todayAppointments,
      current_day: today,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Error fetching doctor stats:", error);
    res.status(500).json({
      error: "Failed to fetch doctor statistics",
      details: error.message,
    });
  }
});

export default router;
