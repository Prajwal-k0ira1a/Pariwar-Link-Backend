import express from "express";
import {
  createPerson,
  getAllPeople,
  getPersonById,
  updatePerson,
  deletePerson,
} from "../controllers/personController.js";
import {
  addOrUpdateRelation,
  getPersonWithRelations,
} from "../controllers/FamilyController.js";

const router = express.Router();

router.post("/", createPerson);
router.get("/", getAllPeople);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

// Family relations
router.post("/relations", addOrUpdateRelation);
router.get("/relations/:id", getPersonWithRelations);

export default router;
