import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
export const getStats = async (req, res) => {
    try {
        const users = await userModel.countDocuments();
        const products = await productModel.countDocuments();
        const categories = await categoryModel.countDocuments();
        const orders = await orderModel.countDocuments();
        const data = {
            users,
            products,
            categories,
            orders
        }
        res.status(200).json({
            success: true,
            message: "data Fetched Successfully",
            data
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            users
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Failed to fetched users data",
            error
        })
    }
}


export const deleteUserAccount = async (req, res) => {
    try {
        const { uId } = req.params;
        const users = await userModel.findByIdAndDelete(uId);
        res.status(200).json({
            success: true,
            message: "User Delete Successfully",
            users
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Failed to fetched users data",
            error
        })
    }
}