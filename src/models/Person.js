import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this person record
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic personal info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: Date,
    deathDate: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    photoUrl: { type: String, required: true },
    phoneNumber: String,
    socialLinks: {
      facebook: String,
      instagram: String,
    },
    nickname: String,
  },
  { timestamps: true }
);

// Index for faster user-based queries
PersonSchema.index({ user: 1 });

export default mongoose.model("Person", PersonSchema);
