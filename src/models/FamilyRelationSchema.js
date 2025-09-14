import mongoose from "mongoose";
const { Schema } = mongoose;

const FamilyRelationSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
  parents: [{ type: Schema.Types.ObjectId, ref: "Person" }],
  children: [{ type: Schema.Types.ObjectId, ref: "Person" }],
  siblings: [{ type: Schema.Types.ObjectId, ref: "Person" }],
  spouse: [{ type: Schema.Types.ObjectId, ref: "Person" }],
}, { timestamps: true });

export const FamilyRelation = mongoose.model("FamilyRelation", FamilyRelationSchema);
