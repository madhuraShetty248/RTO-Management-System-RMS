import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware, ROLES } from "../middlewares/roleMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import {
  uploadDocument,
  getEntityDocuments,
  verifyDocument,
  downloadDocument,
} from "../controllers/documentController";

const router = Router();

// Upload document (Authenticated users)
router.post(
  "/documents/upload",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

// Get documents for an entity (Authenticated users)
router.get("/documents/entity/:entityId", authMiddleware, getEntityDocuments);

// Verify document (Officer only)
router.put(
  "/documents/:id/verify",
  authMiddleware,
  roleMiddleware([ROLES.RTO_OFFICER, ROLES.RTO_ADMIN]),
  verifyDocument
);

// Download document (Authenticated users - validation logic typically needed to ensure checking user owns the doc or is admin)
router.get("/documents/:id/download", authMiddleware, downloadDocument);

export default router;
