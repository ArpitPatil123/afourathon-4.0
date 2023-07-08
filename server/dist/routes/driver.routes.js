import { Router } from "express";
import { addDriver, deleteDriver, getAllDrivers, assignCab, getAllDriversWithCab, unassignCab, getAllDriversWithoutCab, updateDriver, } from "../controllers/driver.controller.js";
const router = Router();
// Add driver details in the database
router.post("/add_driver", addDriver);
// Get all the drivers from the database
router.get("/get_all_drivers", getAllDrivers);
// Delete driver details from the database
router.delete("/delete_driver/:driverId", deleteDriver);
// Assign cab to the driver
router.put("/assign_cab/:driverId/:cabRegistrationNumber", assignCab);
// Unassign cab from the driver
router.put("/unassign_cab/:driverId", unassignCab);
// Get all drivers with cab assigned
router.get("/get_all_drivers_with_cab", getAllDriversWithCab);
// Get all drivers without cab assigned
router.get("/get_all_drivers_without_cab", getAllDriversWithoutCab);
// Update driver details in the database
router.put("/update_driver/:driverId", updateDriver);
export default router;
