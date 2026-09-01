import { Router } from "express";

import {
  getStockMovements,
  createStockMovement,
} from "../controllers/stockController";

const router = Router();

router.get("/", getStockMovements);
router.post("/", createStockMovement);

export default router;