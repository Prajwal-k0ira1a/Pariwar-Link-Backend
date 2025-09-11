// src/routes/people.routes.js
import { Router } from "express";
import {
  createPerson,
  listPeople,
  getPersonById,
  updatePerson,
  deletePerson
} from "../controllers/personController.js";

const router = Router();

router.get("/list", listPeople);      // GET /api/people?q=search
router.post("/", createPerson);   // POST /api/people
router.get("/:id", getPersonById);
router.patch("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
