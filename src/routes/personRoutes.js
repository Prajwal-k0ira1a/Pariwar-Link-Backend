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
router.post("/create", createPerson);
router.get("/all", getAllPeople);

// Routes that need person ownership check
router.get("/get/:personId", checkPersonOwnership, getPersonById);
router.put("/update/:personId", checkPersonOwnership, updatePerson);
router.delete("/delete/:personId", checkPersonOwnership, deletePerson);

// Family relation routes
router.post("/:personId/relations", checkPersonOwnership, addRelation);
router.get("/:personId/relations", checkPersonOwnership, getPersonRelations);
router.delete("/relations/:relationId", checkRelationOwnership, removeRelation);

export default router;
