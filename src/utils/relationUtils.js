// src/utils/relationUtils.js
import Person from "../models/Person.js";
import mongoose from "mongoose";

const valid = (id) => mongoose.isValidObjectId(id);

export const linkParentChild = async (parentId, childId) => {
  if (!valid(parentId) || !valid(childId)) return;
  await Person.findByIdAndUpdate(parentId, { $addToSet: { children: childId } });
  await Person.findByIdAndUpdate(childId, { $addToSet: { parents: parentId } });
};

export const unlinkParentChild = async (parentId, childId) => {
  if (!valid(parentId) || !valid(childId)) return;
  await Person.findByIdAndUpdate(parentId, { $pull: { children: childId } });
  await Person.findByIdAndUpdate(childId, { $pull: { parents: parentId } });
};

export const linkSpouses = async (p1, p2) => {
  if (!valid(p1) || !valid(p2)) return;
  await Person.findByIdAndUpdate(p1, { $addToSet: { spouses: p2 } });
  await Person.findByIdAndUpdate(p2, { $addToSet: { spouses: p1 } });
};

export const unlinkSpouses = async (p1, p2) => {
  if (!valid(p1) || !valid(p2)) return;
  await Person.findByIdAndUpdate(p1, { $pull: { spouses: p2 } });
  await Person.findByIdAndUpdate(p2, { $pull: { spouses: p1 } });
};

// Remove all references to personId from other docs (used before/after delete)
export const removePersonReferences = async (personId) => {
  if (!valid(personId)) return;
  await Person.updateMany(
    { $or: [{ parents: personId }, { spouses: personId }, { children: personId }] },
    { $pull: { parents: personId, spouses: personId, children: personId } }
  );
};
