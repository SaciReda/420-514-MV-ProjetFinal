import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("mongo db connecter we up twin");
  } catch (error) {
    console.error("mongodb marche pas :", error);
    process.exit(1);
  }
}
