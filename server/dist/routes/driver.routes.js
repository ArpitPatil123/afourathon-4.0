import { Router } from "express";
import { addDriver, deleteDriver, getAllDrivers, assignCab, } from "../controllers/driver.controller.js";
const router = Router();
// Add driver details in the database
router.post("/add_driver", addDriver);
// Get all the drivers from the database
router.get("/get_all_drivers", getAllDrivers);
// Delete driver details from the database
router.delete("/delete_driver/:driverId", deleteDriver);
// Assign cab to the driver
router.put("/assign_cab/:driverId/:cabId", assignCab);
export default router;
