import express from "express";
import { deleteUserAccount, getStats, getUsers } from "../controllers/miscellaneousController.js";
const router = express.Router();
router.get("/admin/stats", getStats);
router.get("/admin/stat/get-users", getUsers);
router.delete("/admin/stat/delete/:uId", deleteUserAccount);

export default router