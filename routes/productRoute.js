import express from "express";
import { isAdmin, requredSignIn, validateBody } from "../middlewares/authMiddleware.js";
import { createProduct, deleteProduct, filterProduct, getAllProducts, getProduct, productCategory, productCount, productImage, productList, relatedProducts, searchProduct, updateProduct } from "../controllers/productController.js";
import formidable from "express-formidable"
import upload from "../middlewares/multerMiddleware.js";
// import { createProducts } from "../controllers/filterProduct.js";

const productRouter = express.Router();

//ROUTES

//CREATE PRODUCT
productRouter.post("/create-product", upload.single('image'), requredSignIn, isAdmin, createProduct);

//GET ALL PRODUCT
productRouter.get("/getall-products", getAllProducts);

//GET SINGLE PRODUCT
productRouter.get("/get-product/:slug", getProduct);

//GET PRODUCT IMAGE
productRouter.get("/product-image/:pid", productImage);

//DELETE PRODUCT
productRouter.delete("/delete-product/:pid", deleteProduct);

//UPDATE PRODUCT
productRouter.put("/update-product/:pid", requredSignIn, isAdmin, formidable(), updateProduct);

//FILTER PRODUCT
productRouter.get("/filters-product", filterProduct);

//PRODUCT COUNT
productRouter.get("/product-count", productCount);

//PRODUCT PER PAGE
productRouter.get("/product-list/:page", productList);

//SEARCH PRODUCT
productRouter.get("/search", searchProduct);

//SIMILA PRODUCT
productRouter.get("/related-product/:pid/:cid", relatedProducts);

//CATEGORY WISE PRODUCT
productRouter.get("/product-category/:slug", productCategory);

export default productRouter