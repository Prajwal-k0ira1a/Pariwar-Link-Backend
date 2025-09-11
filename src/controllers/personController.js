import Person from "../models/Person.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to format response
const formatPersonResponse = (person) => ({
  _id: person._id,
  firstName: person.firstName,
  lastName: person.lastName,
  birthDate: person.birthDate,
  deathDate: person.deathDate,
  gender: person.gender,
  biography: person.biography,
  photoUrl: person.photoUrl,
  grandParents: person.grandParents,
  parents: person.parents,
  children: person.children,
  spouse: person.spouse,
  unclesAndAunts: person.unclesAndAunts,
  createdAt: person.createdAt,
  updatedAt: person.updatedAt
});

// Create a new person
export const createPerson = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      deathDate,
      gender,
      biography,
      photoUrl,
      grandParents = [],
      parents = [],
      children = [],
      spouse = [],
      unclesAndAunts = []
    } = req.body;

    const person = new Person({
      firstName,
      lastName,
      birthDate,
      deathDate,
      gender,
      biography,
      photoUrl: photoUrl || '/default-avatar.png',
      grandParents,
      parents,
      children,
      spouse,
      unclesAndAunts
    });

    await person.save();
    res.status(201).json({ success: true, data: formatPersonResponse(person) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all people with pagination and search
export const getPeople = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { biography: { $regex: search, $options: 'i' } }
      ];
    }

    const people = await Person.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Person.countDocuments(query);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count,
      data: people.map(person => formatPersonResponse(person))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single person by ID
export const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        error: 'Person not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: formatPersonResponse(person) 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a person
export const updatePerson = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'firstName', 'lastName', 'birthDate', 'deathDate', 
      'gender', 'biography', 'photoUrl', 'grandParents', 
      'parents', 'children', 'spouse', 'unclesAndAunts'
    ];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid updates!' 
      });
    }

    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        error: 'Person not found' 
      });
    }

    updates.forEach(update => person[update] = req.body[update]);
    await person.save();

    res.status(200).json({ 
      success: true, 
      data: formatPersonResponse(person) 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a person
export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        error: 'Person not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add family relationship
export const addFamilyMember = async (req, res) => {
  try {
    const { personId } = req.params;
    const { relationship, memberData } = req.body;
    
    const validRelationships = [
      'grandParents', 'parents', 'children', 'spouse', 'unclesAndAunts'
    ];

    if (!validRelationships.includes(relationship)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid relationship type'
      });
    }

    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'Person not found'
      });
    }

    person[relationship].push(memberData);
    await person.save();

    res.status(200).json({
      success: true,
      data: formatPersonResponse(person)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove family relationship
export const removeFamilyMember = async (req, res) => {
  try {
    const { personId, memberId } = req.params;
    const { relationship } = req.body;
    
    const validRelationships = [
      'grandParents', 'parents', 'children', 'spouse', 'unclesAndAunts'
    ];

    if (!validRelationships.includes(relationship)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid relationship type'
      });
    }

    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'Person not found'
      });
    }

    person[relationship] = person[relationship].filter(
      member => member._id.toString() !== memberId
    );
    
    await person.save();

    res.status(200).json({
      success: true,
      data: formatPersonResponse(person)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
    await removePersonReferences(id);

    const deleted = await Person.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ status: false, message: "Not found" });

    res.json({ status: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
