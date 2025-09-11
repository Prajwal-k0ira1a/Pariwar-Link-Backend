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

// Helper to validate person data
const validatePersonData = (data) => {
  const errors = [];
  
  if (!data.firstName) errors.push('First name is required');
  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Valid gender is required (Male, Female, Other)');
  }
  
  // Validate nested objects if present
  if (data.parents) {
    data.parents.forEach((parent, index) => {
      if (!parent.role || !['Father', 'Mother', 'Guardian', 'Other'].includes(parent.role)) {
        errors.push(`Parent ${index + 1}: Valid role is required`);
      }
    });
  }
  
  return errors;
};

// Create a new person
export const createPerson = async (req, res) => {
  try {
    // Validate required fields
    const validationErrors = validatePersonData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Set default values
    const personData = {
      ...req.body,
      photoUrl: req.body.photoUrl || '/default-avatar.png',
      // Initialize empty arrays if not provided
      grandParents: req.body.grandParents || [],
      parents: req.body.parents || [],
      children: req.body.children || [],
      spouse: req.body.spouse || [],
      unclesAndAunts: req.body.unclesAndAunts || []
    };

    const person = new Person(personData);
    await person.save();
    
    res.status(201).json({ 
      success: true, 
      data: formatPersonResponse(person) 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Failed to create person',
      details: error.message 
    });
  }
};

// Get all people
export const getPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json({
      success: true,
      count: people.length,
      data: people.map(person => formatPersonResponse(person))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single person by ID
export const getPerson = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    
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
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID' 
      });
    }

    // Validate the update data
    if (req.body.gender && !['Male', 'Female', 'Other'].includes(req.body.gender)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid gender value. Must be one of: Male, Female, Other'
      });
    }

    // Prevent updating protected fields
    const updateData = { ...req.body };
    delete updateData._id; // Prevent ID changes
    delete updateData.createdAt; // Prevent modification of creation date
    delete updateData.updatedAt; // This will be set automatically

    const person = await Person.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
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
    res.status(400).json({ 
      success: false, 
      error: 'Failed to update person',
      details: error.message 
    });
  }
};

// Delete a person
export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID' 
      });
    }

    // First delete the person
    const person = await Person.findByIdAndDelete(id);
    
    if (!person) {
      return res.status(404).json({ 
        success: false, 
        error: 'Person not found' 
      });
    }

    // If you have a removePersonReferences function, you would call it here
    // await removePersonReferences(id);

    res.status(200).json({ 
      success: true, 
      message: 'Person deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
