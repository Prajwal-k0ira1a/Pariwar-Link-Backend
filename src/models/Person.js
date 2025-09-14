import mongoose from "mongoose";
const { Schema } = mongoose;

const PersonSchema = new Schema(
  {// link to User
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

export default mongoose.model("Person", PersonSchema);
