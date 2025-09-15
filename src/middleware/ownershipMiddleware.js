import { FamilyRelation } from "../models/FamilyRelationSchema.js";
import Person from "../models/Person.js";

// Check if person exists and belongs to the current user
export const checkPersonOwnership = async (req, res, next) => {
  try {
    const person = await Person.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found or access denied' });
    }
    
    req.person = person;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if relationship exists and belongs to the current user
export const checkRelationOwnership = async (req, res, next) => {
  try {
    const relation = await FamilyRelation.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!relation) {
      return res.status(404).json({ message: 'Relationship not found or access denied' });
    }
    
    req.relation = relation;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
