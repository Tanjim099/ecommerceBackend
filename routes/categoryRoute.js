import express from "express";
import { isAdmin, requredSignIn } from "../middlewares/authMiddleware.js";
import { createCategory, deleteCategory, getCategory, singleCategory, updateCategory } from "../controllers/categoryController.js";
import upload from "../middlewares/multerMiddleware.js";

const categoryRoutes = express.Router();

//routes

//CREATE CATEGORY
categoryRoutes.post("/create-category", upload.single('icon'), createCategory);


//UPDATE CATEGORY
categoryRoutes.put("/update-category/:id", requredSignIn, isAdmin, updateCategory);

//GET ALL CATEGORYS
categoryRoutes.get("/get-category", getCategory);

//GET CATEGORY BY ID
categoryRoutes.get("/single-category/:slug", singleCategory);

//DELETE CATEGORY
categoryRoutes.delete("/delete-category/:id", requredSignIn, isAdmin, deleteCategory);

export default categoryRoutes