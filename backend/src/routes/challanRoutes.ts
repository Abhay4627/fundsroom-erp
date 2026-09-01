import { Router } from "express";

import {
  getChallans,
  getChallanById,
  createChallan,
} from "../controllers/challanController";

const router = Router();

router.get("/", getChallans);
router.get("/:id", getChallanById);
router.post("/", createChallan);

export default router;