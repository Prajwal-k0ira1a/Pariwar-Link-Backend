import { FamilyRelation } from "../models/FamilyRelationSchema.js";
import Person from "../models/Person.js";

// Add or update family relationships
export const addOrUpdateRelation = async (req, res) => {
  const { personId, parents, children, siblings, spouse } = req.body;

  try {
    // Check if person exists
    const personExists = await Person.findById(personId);
    if (!personExists) return res.status(404).json({ message: "Person not found" });

    let relation = await FamilyRelation.findOne({ person: personId });

    if (relation) {
      // Update existing
      relation.parents = parents || relation.parents;
      relation.children = children || relation.children;
      relation.siblings = siblings || relation.siblings;
      relation.spouse = spouse || relation.spouse;
      await relation.save();
    } else {
      // Create new
      relation = await FamilyRelation.create({ person: personId, parents, children, siblings, spouse });
    }

    res.json(relation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a person with populated relationships
export const getPersonWithRelations = async (req, res) => {
  try {
    const relation = await FamilyRelation.findOne({ person: req.params.id })
      .populate("parents")
      .populate("children")
      .populate("siblings")
      .populate("spouse");

    if (!relation) return res.status(404).json({ message: "Relations not found" });

    res.json(relation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
