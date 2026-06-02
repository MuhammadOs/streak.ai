import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  archiveHabit,
  reorderHabits,
} from "../controllers/habitController.js";

const router = express.Router();

//every habit route requires protect for authentication
router.use(protect);

router.get("/", getHabits);
router.post("/", createHabit);
router.put("/reorder", reorderHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.put("/:id/archive", archiveHabit);

export default router;
