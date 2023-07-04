import { Router, Response, Request } from "express";
import { Driver } from "../utils/types";

const router: Router = Router();

// Add driver details in the database
router.post("/add_driver", (req: Request, res: Response) => {
  const { name, email, id, phone }: Driver = req.body;

  // Check if the driver already exists
});

export default router;
