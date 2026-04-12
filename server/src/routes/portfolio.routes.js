import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
} from "../controllers/portfolio.controller.js";

const router = Router();

// Public route to get all portfolio items for display on the site
router.route("/").get(getAllPortfolios);

// Admin routes 
router.route("/").post(verifyJWT, verifyAdmin, createPortfolio);
router.route("/:id").patch(verifyJWT, verifyAdmin, updatePortfolio);
router.route("/:id").delete(verifyJWT, verifyAdmin, deletePortfolio);

export default router;