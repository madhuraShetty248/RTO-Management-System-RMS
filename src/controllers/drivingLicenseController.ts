import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { getDlApplicationById, updateDlApplicationStatus } from "../models/dlApplicationModel";
import { createDrivingLicense, getDrivingLicenseByUserId } from "../models/drivingLicenseModel";

// Approve a DL application (admin or officer only)
export const approveApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get the application
    const application = await getDlApplicationById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "PENDING") {
      return res.status(400).json({ message: "Application already processed" });
    }

    // Check if user already has a license
    const existingLicense = await getDrivingLicenseByUserId(application.user_id);
    if (existingLicense) {
      return res.status(400).json({ message: "User already has a driving license" });
    }

    // Update application status to APPROVED
    await updateDlApplicationStatus(id, "APPROVED");

    // Create the driving license
    const license = await createDrivingLicense(application.user_id);

    res.json({ message: "Application approved and license issued", license });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Failed to approve application" });
  }
};

// Reject a DL application (admin or officer only)
export const rejectApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get the application
    const application = await getDlApplicationById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "PENDING") {
      return res.status(400).json({ message: "Application already processed" });
    }

    // Update application status to REJECTED
    const updatedApplication = await updateDlApplicationStatus(id, "REJECTED");

    res.json({ message: "Application rejected", application: updatedApplication });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Failed to reject application" });
  }
};
