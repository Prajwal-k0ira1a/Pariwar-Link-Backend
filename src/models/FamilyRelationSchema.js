import mongoose from "mongoose";
const { Schema } = mongoose;

const FamilyRelationSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
  relation_type: { type: String, enum: ["Grand Father","Grand Mother","mother", "father", "sibling", "cousin","spouse", "child"], required: true },
  related_person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
}, { timestamps: true });

export const FamilyRelation = mongoose.model("FamilyRelation", FamilyRelationSchema);
