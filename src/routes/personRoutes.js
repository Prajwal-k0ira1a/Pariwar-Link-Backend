import express from "express";
import {
  createPerson,
  getAllPeople,
  getPersonById,
  updatePerson,
  deletePerson,
} from "../controllers/personController.js";
import {
  addRelation,
  getPersonRelations,
  removeRelation
} from "../controllers/FamilyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkPersonOwnership, checkRelationOwnership } from "../middleware/ownershipMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Person CRUD routes
router.post("/", createPerson);
router.get("/", getAllPeople);
router.get("/:id", checkPersonOwnership, getPersonById);
router.put("/:id", checkPersonOwnership, updatePerson);
router.delete("/:id", checkPersonOwnership, deletePerson);

// Family relation routes
router.post("/:id/relations", checkPersonOwnership, addRelation);
router.get("/:id/relations", checkPersonOwnership, getPersonRelations);
router.delete("/relations/:id", checkRelationOwnership, removeRelation);

export default router;
