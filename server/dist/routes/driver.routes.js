import { Router } from "express";
const router = Router();
// Add driver details in the database
router.post("/add_driver", (req, res) => {
    const { name, email, id, phone } = req.body;
    // Check if the driver already exists
});
export default router;
