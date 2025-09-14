import { Router } from "express";
import { getDb } from "../utils/db.js";

const router = Router();

// GET /api/bookings - Get all bookings
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");
    const bookings = await bookingsCollection.find({}).toArray();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({
      error: "Failed to fetch bookings",
      details: error.message,
    });
  }
});

// GET /api/bookings/today - Get today's bookings
router.get("/today", async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");

    // Get today's date in the same format as stored in DB
    const today = new Date();
    const todayFormatted = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    // Method 1: Query by the formatted date string
    const bookingsByDate = await bookingsCollection
      .find({
        date: todayFormatted,
      })
      .toArray();

    // Method 2: Also query by start date (in case date field is missing)
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const bookingsByStart = await bookingsCollection
      .find({
        start: {
          $gte: startOfDay.toISOString(),
          $lte: endOfDay.toISOString(),
        },
      })
      .toArray();

    // Combine both results and remove duplicates
    const allTodayBookings = [...bookingsByDate];

    // Add bookings from start date query that aren't already included
    bookingsByStart.forEach((booking) => {
      if (
        !allTodayBookings.some(
          (existing) => existing._id.toString() === booking._id.toString()
        )
      ) {
        allTodayBookings.push(booking);
      }
    });

    // Sort by start time
    allTodayBookings.sort((a, b) => {
      if (a.start && b.start) {
        return new Date(a.start) - new Date(b.start);
      }
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });

    res.status(200).json({
      success: true,
      date: todayFormatted,
      count: allTodayBookings.length,
      data: allTodayBookings,
    });
  } catch (error) {
    console.error("❌ Error fetching today's bookings:", error);
    res.status(500).json({
      error: "Failed to fetch today's bookings",
      details: error.message,
    });
  }
});

// GET /api/bookings/date/:date - Get bookings by specific date
router.get("/date/:date", async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");
    const { date } = req.params;

    // Try to parse the date parameter
    let targetDate;
    try {
      targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (err) {
      return res.status(400).json({
        error: "Invalid date format",
        message: "Please use YYYY-MM-DD format",
      });
    }

    // Format date to match DB format
    const formattedDate = targetDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    // Query by formatted date
    const bookingsByDate = await bookingsCollection
      .find({
        date: formattedDate,
      })
      .toArray();

    // Also query by start date range
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookingsByStart = await bookingsCollection
      .find({
        start: {
          $gte: startOfDay.toISOString(),
          $lte: endOfDay.toISOString(),
        },
      })
      .toArray();

    // Combine results
    const allBookings = [...bookingsByDate];
    bookingsByStart.forEach((booking) => {
      if (
        !allBookings.some(
          (existing) => existing._id.toString() === booking._id.toString()
        )
      ) {
        allBookings.push(booking);
      }
    });

    // Sort by time
    allBookings.sort((a, b) => {
      if (a.start && b.start) {
        return new Date(a.start) - new Date(b.start);
      }
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });

    res.status(200).json({
      success: true,
      date: formattedDate,
      requested_date: date,
      count: allBookings.length,
      data: allBookings,
    });
  } catch (error) {
    console.error("❌ Error fetching bookings for date:", error);
    res.status(500).json({
      error: "Failed to fetch bookings for date",
      details: error.message,
    });
  }
});

// GET /api/bookings/doctor/:doctor_id - Get bookings by doctor_id
router.get("/doctor/:doctor_id", async (req, res) => {
  try {
    const db = getDb();
    const bookingsCollection = db.collection("bookings");
    const { doctor_id } = req.params;

    if (!doctor_id) {
      return res.status(400).json({ error: "doctor_id is required" });
    }

    const bookings = await bookingsCollection.find({ doctor_id }).toArray();

    res.status(200).json({
      success: true,
      doctor_id,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching bookings for doctor:", error);
    res.status(500).json({
      error: "Failed to fetch bookings for doctor",
      details: error.message,
    });
  }
});

export default router;
