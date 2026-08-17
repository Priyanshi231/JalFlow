import { Router } from "express";
import {
  getDrivers,
  createDriver,
  updateDriver
} from "../controllers/driverController.js";

const router = Router();

router.get("/", getDrivers);
router.post("/", createDriver);
router.patch("/:id", updateDriver);

export default router;
