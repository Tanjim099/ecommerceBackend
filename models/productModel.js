import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    shipping: {
        type: Boolean
    }
},
    { timestamps: true }
);

export default mongoose.model("Products", productSchema)