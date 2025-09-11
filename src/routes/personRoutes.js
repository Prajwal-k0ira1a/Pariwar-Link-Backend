import { Router } from "express";
import {
  createPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson
} from "../controllers/personController.js";

const router = Router();

// Get all people
router.get("/", getPeople);

// Get a single person by ID
router.get("/:id", getPerson);

// Create a new person
router.post("/", createPerson);

// Update a person
router.patch("/:id", updatePerson);

// Delete a person
router.delete("/:id", deletePerson);

export default router;
