import express from "express";
import movieController from "../controllers/movieController";



const router = express.Router();

router.get("/", movieController.index);


export default router;