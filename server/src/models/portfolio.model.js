import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    client: {
        type: String,
        trim: true,
    },
    project_url: {
        type: String,
        trim: true,
    },
    images: {
        type: [String], // Array of image URLs
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    display_order: {
        type: Number,
        default: 0,
    },
    is_featured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);