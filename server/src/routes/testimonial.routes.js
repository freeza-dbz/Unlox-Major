import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

// Note: You will need to create this controller file and the functions within it.
// e.g., in ../controllers/testimonial.controller.js
import {
    createTestimonial,
    getAllTestimonials,
    updateTestimonial,
    deleteTestimonial,
} from "../controllers/testimonial.controller.js";

const router = Router();

// Public route to get all testimonials for display on the site
router.route("/").get(getAllTestimonials);

// Admin routes - secured with JWT and admin verification
router.route("/").post(verifyJWT, verifyAdmin, createTestimonial);
router.route("/:id").patch(verifyJWT, verifyAdmin, updateTestimonial);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteTestimonial);

export default router;