import { Router } from "express";
import {
  getDashboard,
  getReports
} from "../controllers/reportController.js";

const router = Router();

router.get("/dashboard", getDashboard);
router.get("/analytics", getReports);

export default router;
