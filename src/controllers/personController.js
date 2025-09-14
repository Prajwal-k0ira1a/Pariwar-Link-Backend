import Person from "../models/Person.js";

// Create a new person
export const createPerson = async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all people
export const getAllPeople = async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single person
export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    console.log(person);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a person
export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ message: "Person not found" });
    res.json({ message: "Person deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
