import { Router } from "express";
import {
  getBookings,
  createBooking,
  updateBooking
} from "../controllers/bookingController.js";

const router = Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.patch("/:id", updateBooking);

export default router;
