import express from "express";
import movieController from "../controllers/movieController.js";



const router = express.Router();

router.get("/", movieController.index);
router.get("/search", movieController.search);
router.get("/:slug", movieController.show);

// router.post("/:id/reviews", bookController.storeReview);

export default router;