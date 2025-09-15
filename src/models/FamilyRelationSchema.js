import mongoose from "mongoose";

const FamilyRelationSchema = new mongoose.Schema({
  // Reference to the user who owns this relationship
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  person: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Person", 
    required: true 
  },
  relationType: { 
    type: String, 
    enum: ["grandFather", "grandMother", "mother", "father", "sibling", "cousin", "spouse", "child"], 
    required: true 
  },
  relatedPerson: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Person", 
    required: true 
  },
}, { timestamps: true });

// Indexes for faster queries
FamilyRelationSchema.index({ user: 1 });
FamilyRelationSchema.index({ person: 1 });
FamilyRelationSchema.index({ relatedPerson: 1 });

// Compound index to prevent duplicate relationships
FamilyRelationSchema.index(
  { person: 1, relatedPerson: 1, relationType: 1 },
  { unique: true }
);

export const FamilyRelation = mongoose.model("FamilyRelation", FamilyRelationSchema);
