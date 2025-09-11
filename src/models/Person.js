const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    birthDate: Date,
    deathDate: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    biography: String,
    photoUrl: { type: String, required: true },

    grandParents: [
      {
        firstName: String,
        lastName: String,
        birthDate: Date,
        deathDate: Date,
        biography: String,
        type: { type: String, enum: ["Paternal", "Maternal"] },
        role: { type: String, enum: ["Grandfather", "Grandmother", "Other"] },
        gender: { type: String, enum: ["Male", "Female"] },
        Nickname: String,
      },
    ],
    parents: [
      {
        firstName: String,
        lastName: String,
        birthDate: Date,
        deathDate: Date,
        role: { type: String, enum: ["Father", "Mother", "Guardian", "Other"] },
        gender: { type: String, enum: ["Male", "Female"] },
        biography: String,
        photoUrl: String,
      },
    ],

    children: [
      {
        firstName: String,
        lastName: String,
        birthDate: Date,
        deathDate: Date,
        gender: String,
        biography: String,
        photoUrl: { type: String, required: true },
      },
    ],

    spouse: [
      {
        firstName: String,
        lastName: String,
        birthDate: Date,
        deathDate: Date,
        gender: String,
        biography: String,
        photoUrl: { type: String, required: true },
      },
    ],

    unclesAndAunts: [
      {
        firstName: String,
        lastName: String,
        birthDate: Date,
        deathDate: Date,
        role: {
          type: String,
          enum: [
            "Paternal Uncle",
            "Paternal Aunt",
            "Maternal Uncle",
            "Maternal Aunt",
          ],
        },
        gender: { type: String, enum: ["Male", "Female"] },
        biography: String,
        photoUrl: { type: String, required: true },
        spouse: {
          firstName: String,
          lastName: String,
          photoUrl: String,
        },
        children: [
          {
            firstName: String,
            lastName: String,
            photoUrl: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
export const Person = mongoose.model("Person", PersonSchema);