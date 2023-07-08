import { Router } from "express";
import { addCab, assignDriver, getAllCabs, deleteCab, getAllCabsWithDriver, unassignDriver, getAllCabsWithoutDriver, updateCab, updateCabRegistrationNumber, } from "../controllers/cab.controller.js";
const router = Router();
// create a new cab
router.post("/add_cab", addCab);
// Get all the cabs from the database
router.get("/get_all_cabs", getAllCabs);
// Assign driver to the cab
router.put("/assign_driver/:driverId/:cabRegistrationNumber", assignDriver);
// Unassign driver from the cab
router.put("/unassign_driver/:cabRegistrationNumber", unassignDriver);
// Delete cab details from the database using cabRegistrationNumber
router.delete("/delete_cab/:cabRegistrationNumber", deleteCab);
// Get all the cabs with driver assigned
router.get("/get_all_cabs_with_driver", getAllCabsWithDriver);
// Get all the cabs without driver assigned
router.get("/get_all_cabs_without_driver", getAllCabsWithoutDriver);
// Update the cab details using cabRegistrationNumber
router.put("/update_cab/:cabRegistrationNumber", updateCab);
// Update the cabRegistrationNumber of the cab
router.put("/update_cab_registration_number/:cabRegistrationNumber", updateCabRegistrationNumber);
export default router;
