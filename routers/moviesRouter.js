import express from "express";
import movieController from "../controllers/movieController.js";



const router = express.Router();

router.get("/", movieController.index);


export default router;