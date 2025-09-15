import { FamilyRelation } from "../models/FamilyRelationSchema.js";
import Person from "../models/Person.js";

// Add a new family relationship
export const addRelation = async (req, res) => {
  const { person, relation_type, related_person } = req.body;

  try {
    // Check if both persons exist
    const [personExists, relatedPersonExists] = await Promise.all([
      Person.findById(person),
      Person.findById(related_person)
    ]);

    if (!personExists || !relatedPersonExists) {
      return res.status(404).json({ message: "Person or related person not found" });
    }

    // Check if the relation already exists
    const existingRelation = await FamilyRelation.findOne({
      person,
      related_person,
      relation_type
    });

    if (existingRelation) {
      return res.status(400).json({ message: "This relationship already exists" });
    }

    // Create the relationship
    const relation = await FamilyRelation.create({
      person,
      relation_type,
      related_person
    });

    // If this is a two-way relationship (like parent-child), create the inverse
    if (relation_type === 'father' || relation_type === 'mother') {
      await FamilyRelation.create({
        person: related_person,
        relation_type: 'child',
        related_person: person
      });
    } else if (relation_type === 'spouse') {
      await FamilyRelation.create({
        person: related_person,
        relation_type: 'spouse',
        related_person: person
      });
    } else if (relation_type === 'sibling') {
      await FamilyRelation.create({
        person: related_person,
        relation_type: 'sibling',
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
    
    // Get all relationships where this person is involved
    const relationships = await FamilyRelation.find({
      $or: [
        { person: id },
        { related_person: id }
      ]
    })
    .populate('person', 'firstName lastName photoUrl')
    .populate('related_person', 'firstName lastName photoUrl');

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
          relationType = rel.related_person.gender === 'Male' ? 'father' : 'mother';
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
    
    // Find the relationship to get details before deleting
    const relation = await FamilyRelation.findById(id);
    if (!relation) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    // Delete the relationship
    await FamilyRelation.findByIdAndDelete(id);

    // If this was a two-way relationship, remove the inverse as well
    if (['father', 'mother', 'spouse', 'sibling'].includes(relation.relation_type)) {
      let inverseType = relation.relation_type;
      if (inverseType === 'father' || inverseType === 'mother') {
        inverseType = 'child';
      }
      
      await FamilyRelation.findOneAndDelete({
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
