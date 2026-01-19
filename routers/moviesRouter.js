import express from "express";

const router = express.Router();

router.get("/", movieController.index);


export default router;