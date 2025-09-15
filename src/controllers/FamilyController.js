import { FamilyRelation } from "../models/FamilyRelationSchema.js";
import Person from "../models/Person.js";
import { checkPersonOwnership } from "../middleware/ownershipMiddleware.js";

// Add a new family relationship
export const addRelation = async (req, res) => {
  const { person, relation_type, related_person } = req.body;
  const userId = req.user._id;

  try {
    // Check if the person and related person belong to the current user
    const [personValid, relatedPersonValid] = await Promise.all([
      checkPersonOwnership(person, userId),
      checkPersonOwnership(related_person, userId)
    ]);

    if (!personValid || !relatedPersonValid) {
      return res.status(403).json({ message: "Not authorized to create this relationship" });
    }

    // Check if the relation already exists
    const existingRelation = await FamilyRelation.findOne({
      user: userId,
      person,
      related_person,
      relation_type
    });

    if (existingRelation) {
      return res.status(400).json({ message: "This relationship already exists" });
    }

    // Create the relationship
    const relation = await FamilyRelation.create({
      user: userId,
      person,
      relation_type,
      related_person
    });

    // If this is a two-way relationship, create the inverse
    if (['father', 'mother', 'spouse', 'sibling', 'child'].includes(relation_type)) {
      let inverseType = relation_type;
      
      // Define inverse relationships
      if (relation_type === 'father' || relation_type === 'mother') {
        inverseType = 'child';
      } else if (relation_type === 'child') {
        inverseType = (await Person.findById(related_person)).gender === 'Male' ? 'father' : 'mother';
      }
      // For spouse and sibling, the inverse is the same

      await FamilyRelation.create({
        user: userId,
        person: related_person,
        relation_type: inverseType,
        related_person: person
      });
    }

    res.status(201).json(relation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all relationships for a person
export const getPersonRelations = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verify the person belongs to the user
    const personBelongsToUser = await checkPersonBelongsToUser(id, userId);
    if (!personBelongsToUser) {
      return res.status(403).json({ message: "Not authorized to view these relationships" });
    }
    
    // Get all relationships where this person is involved
    const relationships = await FamilyRelation.find({
      user: userId,
      $or: [
        { person: id },
        { related_person: id }
      ]
    })
    .populate('person', 'firstName lastName photoUrl gender')
    .populate('related_person', 'firstName lastName photoUrl gender');

    if (!relationships || relationships.length === 0) {
      return res.status(404).json({ message: "No relationships found for this person" });
    }

    // Format the response to group by relationship type
    const formattedRelations = relationships.reduce((acc, rel) => {
      const isPersonSubject = rel.person._id.toString() === id;
      const relatedPerson = isPersonSubject ? rel.related_person : rel.person;
      
      let relationType = rel.relation_type;
      
      // If the person is the related_person, we need to invert the relationship
      if (!isPersonSubject) {
        if (relationType === 'father' || relationType === 'mother') {
          relationType = 'child';
        } else if (relationType === 'child') {
          relationType = relatedPerson.gender === 'Male' ? 'father' : 'mother';
        }
      }

      if (!acc[relationType]) {
        acc[relationType] = [];
      }
      
      acc[relationType].push({
        _id: relatedPerson._id,
        firstName: relatedPerson.firstName,
        lastName: relatedPerson.lastName,
        photoUrl: relatedPerson.photoUrl,
        relationId: rel._id
      });

      return acc;
    }, {});

    res.json(formattedRelations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a relationship
export const removeRelation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Find the relationship to verify ownership
    const relation = await FamilyRelation.findOne({
      _id: id,
      user: userId
    });
    
    if (!relation) {
      return res.status(404).json({ message: "Relationship not found or access denied" });
    }

    // Delete the relationship
    await FamilyRelation.findByIdAndDelete(id);

    // If this was a two-way relationship, remove the inverse as well
    if (['father', 'mother', 'spouse', 'sibling', 'child'].includes(relation.relation_type)) {
      let inverseType = relation.relation_type;
      
      if (inverseType === 'father' || inverseType === 'mother') {
        inverseType = 'child';
      } else if (inverseType === 'child') {
        const relatedPerson = await Person.findById(relation.related_person);
        inverseType = relatedPerson.gender === 'Male' ? 'father' : 'mother';
      }
      // For spouse and sibling, the inverse is the same
      
      await FamilyRelation.findOneAndDelete({
        user: userId,
        person: relation.related_person,
        related_person: relation.person,
        relation_type: inverseType
      });
    }

    res.json({ message: "Relationship removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
