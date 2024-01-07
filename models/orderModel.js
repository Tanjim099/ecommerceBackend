import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [
        {
            id: { type: mongoose.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            image: String,
            itemQuantity: Number,
        }
    ],
    payment: {},
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shopped", "Delivered", "Cancel"]
    },
}, { timestamps: true }
);

export default mongoose.model("Order", orderSchema)