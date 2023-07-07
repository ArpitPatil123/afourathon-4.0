import { Router } from "express";
import {
  addCab,
  assignDriver,
  getAllCabs,
  deleteCab,
  getAllCabsWithDriver,
  unassignDriver,
  getAllCabsWithoutDriver,
} from "../controllers/cab.controller.js";

const router = Router();

// create a new cab
router.post("/add_cab", addCab);

// Get all the cabs from the database
router.get("/get_all_cabs", getAllCabs);

// Assign cab to the driver
router.put("/assign_driver/:driverId/:cabRegistrationNumber", assignDriver);

// Unsassign cab from the driver
router.put("/unassign_driver/:cabRegistrationNumber", unassignDriver);

// Delete cab details from the database using cabId
router.delete("/delete_cab/:cabRegistrationNumber", deleteCab);

// Get all the cabs with driver assigned
router.get("/get_all_cabs_with_driver", getAllCabsWithDriver);

// Get all the cabs without driver assigned
router.get("/get_all_cabs_without_driver", getAllCabsWithoutDriver);

export default router;
