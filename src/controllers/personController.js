import Person from "../models/Person.js";
import { FamilyRelation } from "../models/FamilyRelationSchema.js";

// Create a new person
export const createPerson = async (req, res) => {
  try {
    // Add the current user's ID to the person data
    const personData = {
      ...req.body,
      user: req.user._id
    };
    
    const person = await Person.create(personData);
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all people for the authenticated user
export const getAllPeople = async (req, res) => {
  try {
    const people = await Person.find({ user: req.user._id });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single person (ownership check is handled by middleware)
export const getPersonById = async (req, res) => {
  try {
    // The person is already attached to req by the checkPersonOwnership middleware
    res.json(req.person);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a person
export const updatePerson = async (req, res) => {
  try {
    // The person is already attached to req by the checkPersonOwnership middleware
    const person = await Person.findByIdAndUpdate(
      req.person._id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a person and their relationships
export const deletePerson = async (req, res) => {
  try {
    // The person is already attached to req by the checkPersonOwnership middleware
    await Person.findByIdAndDelete(req.person._id);
    
    // Delete all relationships involving this person
    await FamilyRelation.deleteMany({
      $or: [
        { person: req.person._id },
        { related_person: req.person._id }
      ]
    });
    
    res.json({ message: "Person and their relationships deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
