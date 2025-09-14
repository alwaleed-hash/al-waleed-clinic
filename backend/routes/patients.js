import { Router } from "express";
import { getDb } from "../utils/db.js";

const router = Router();

// GET /api/patients - Get all patients
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const patientsCollection = db.collection("patients");
    const patients = await patientsCollection.find({}).toArray();

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    res.status(500).json({
      error: "Failed to fetch patients",
      details: error.message,
    });
  }
});

// GET /api/patients/search/:query - Search patients by phone number or serial code
router.get("/search/:query", async (req, res) => {
  try {
    const db = getDb();
    const patientsCollection = db.collection("patients");
    const { query } = req.params;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: "Search query must be at least 2 characters long",
      });
    }
    // Create search regex for partial matching
    const searchRegex = new RegExp(query.trim(), "i");

    const patients = await patientsCollection
      .find({
        $or: [{ phone_number: searchRegex }, { serial_code: searchRegex }],
      })
      .toArray();

    res.status(200).json({
      success: true,
      query: query.trim(),
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("❌ Error searching patients:", error);
    res.status(500).json({
      error: "Failed to search patients",
      details: error.message,
    });
  }
});

// GET /api/patients/phone/:phone - Get patient by phone number
router.get("/phone/:phone", async (req, res) => {
  try {
    const db = getDb();
    const patientsCollection = db.collection("patients");
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    const patient = await patientsCollection.findOne({ phone_number: phone });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
        phone_number: phone,
      });
    }

    res.status(200).json({
      success: true,
      phone_number: phone,
      data: patient,
    });
  } catch (error) {
    console.error("❌ Error fetching patient by phone:", error);
    res.status(500).json({
      error: "Failed to fetch patient by phone",
      details: error.message,
    });
  }
});

// GET /api/patients/:id - Get patient by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const patientsCollection = db.collection("patients");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Try to find by ObjectId or string ID
    let patient;
    try {
      const { ObjectId } = await import("mongodb");
      patient = await patientsCollection.findOne({ _id: new ObjectId(id) });
    } catch (objectIdError) {
      // If ObjectId fails, try as string
      patient = await patientsCollection.findOne({ _id: id });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
        patient_id: id,
      });
    }

    res.status(200).json({
      success: true,
      patient_id: id,
      data: patient,
    });
  } catch (error) {
    console.error("❌ Error fetching patient by ID:", error);
    res.status(500).json({
      error: "Failed to fetch patient by ID",
      details: error.message,
    });
  }
});

export default router;
