import { Router } from "express";
import {
  addCab,
  assignDriver,
  getAllCabs,
  deleteCab,
} from "../controllers/cab.controller.js";

const router = Router();

// create a new cab
router.post("/add_cab", addCab);

// Get all the cabs from the database
router.get("/get_all_cabs", getAllCabs);

// Assign cab to the driver
router.put("/assign_driver/:driverId/:cabId", assignDriver);

// Delete cab details from the database using cabId
router.delete("/delete_cab/:cabRegistrationNumber", deleteCab);

export default router;
