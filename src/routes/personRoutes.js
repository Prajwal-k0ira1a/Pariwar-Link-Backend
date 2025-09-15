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

const router = express.Router();

// Person CRUD routes
router.post("create/", createPerson);
router.get("get/", getAllPeople);
router.get("get/:id", getPersonById);
router.put("update/:id", updatePerson);
router.delete("delete/:id", deletePerson);

// Family relation routes
router.post("add/:id/relations", addRelation);
router.get("getRelations/:id/relations", getPersonRelations);
router.delete("remove/relations/:id", removeRelation);

export default router;
