import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { approveApplication, rejectApplication } from "../controllers/drivingLicenseController";

const router = Router();

// Admin or Officer only routes
router.put("/dl/applications/:id/approve", authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.OFFICER]), approveApplication);
router.put("/dl/applications/:id/reject", authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.OFFICER]), rejectApplication);

export default router;
