import { MongoClient } from "mongodb";

let db = null;
let client = null;

export const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/dental-clinic";
    
    client = new MongoClient(mongoUri);
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = process.env.DB_NAME || mongoUri.split('/').pop().split('?')[0] || "dental-clinic";
    console.log("🗄️ Using database:", dbName);
    
    db = client.db(dbName);
    
    // Test the connection
    await db.admin().ping();
    console.log("✅ MongoDB connection successful");
    
    // List all collections for debugging
    const collections = await db.listCollections().toArray();
    console.log("📚 Available collections:", collections.map(c => c.name));
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDb() first.");
  }
  return db;
};

export const closeDb = async () => {
  if (client) {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
};
