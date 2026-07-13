import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../server/.env") });

const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to:", MONGO_URI);

try {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB!");

  const User = mongoose.model(
    "User",
    new mongoose.Schema({}, { strict: false }),
  );
  const Certificate = mongoose.model(
    "Certificate",
    new mongoose.Schema({}, { strict: false }),
  );

  const users = await User.find({});
  console.log("--- USERS ---");
  users.forEach((u) => {
    console.log(`ID: ${u._id}, Email: ${u.email}, Role: ${u.role}`);
  });

  const certificates = await Certificate.find({});
  console.log("--- CERTIFICATES ---");
  certificates.forEach((c) => {
    console.log(
      `ID: ${c._id}, OwnerId: ${c.ownerId}, Title: ${c.title}, Org: ${c.organization}`,
    );
  });

  await mongoose.disconnect();
} catch (err) {
  console.error("Error:", err);
}
