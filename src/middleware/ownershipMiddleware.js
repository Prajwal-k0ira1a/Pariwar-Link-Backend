import { FamilyRelation } from "../models/FamilyRelationSchema.js";
import Person from "../models/Person.js";

// Check if person exists and belongs to the current user
export const checkPersonOwnership = async (req, res, next) => {
  try {
    // Handle both direct ID parameter and req.params.id
    const personId = req.params.id || req.params.personId || req.body.personId;
    
    if (!personId) {
      return res.status(400).json({ message: 'Person ID is required' });
    }
    
    const person = await Person.findOne({ 
      _id: personId,
      user: req.user._id 
    });
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found or access denied' });
    }
    
    req.person = person;
    next();
  } catch (error) {
    console.error('Error in checkPersonOwnership:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if relationship exists and belongs to the current user
export const checkRelationOwnership = async (req, res, next) => {
  try {
    // Handle both direct ID parameter and req.params.id
    const relationId = req.params.id || req.params.relationId || req.body.relationId;
    
    if (!relationId) {
      return res.status(400).json({ message: 'Relationship ID is required' });
    }
    
    const relation = await FamilyRelation.findOne({
      _id: relationId,
      user: req.user._id
    });
    
    if (!relation) {
      return res.status(404).json({ message: 'Relationship not found or access denied' });
    }
    
    req.relation = relation;
    next();
  } catch (error) {
    console.error('Error in checkRelationOwnership:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
