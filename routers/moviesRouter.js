import express from "express";
import movieController from "../controllers/movieController.js";
import upload from "../middlewares/handleErrors.js";


const router = express.Router();

router.get("/", movieController.index);
router.get("/search", movieController.search);
router.get("/:slug", movieController.show);
// router.post("/:id/reviews", movieController.storeReview);



export default router;