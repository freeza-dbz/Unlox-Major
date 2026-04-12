import mongoose from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Portfolio } from "../models/portfolio.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllPortfolios = asyncHandler(async (req, res) => {
    const portfolios = await Portfolio.find().sort({ display_order: 'asc', createdAt: 'desc' });

    if (!portfolios) {
        throw new ApiError(404, "No portfolio items found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, portfolios, "Portfolio items fetched successfully"));
});

const createPortfolio = asyncHandler(async (req, res) => {
    const { title, description, category, client, project_url, images, tags, display_order, is_featured } = req.body;

    if ([title, description, category].some((field) => !field || (typeof field === 'string' && field.trim() === ""))) {
        throw new ApiError(400, "Title, description, and category are required");
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    const portfolio = await Portfolio.create({
        title,
        description,
        category,
        client,
        project_url,
        images,
        tags,
        display_order,
        is_featured
    });

    if (!portfolio) {
        throw new ApiError(500, "Something went wrong while creating the portfolio item");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, portfolio, "Portfolio item created successfully"));
});

const updatePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid portfolio ID");
    }

    const allowedFields = [
        "title",
        "description",
        "category",
        "client",
        "project_url",
        "images",
        "tags",
        "display_order",
        "is_featured"
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
            new: true,
            runValidators: true
        }
    );

    if (!portfolio) {
        throw new ApiError(404, "Portfolio item not found");
    }

    return res.status(200).json(
        new ApiResponse(200, portfolio, "Portfolio item updated successfully")
    );
});

const deletePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Portfolio ID");
    }

    const portfolio = await Portfolio.findByIdAndDelete(id);

    if (!portfolio) {
        throw new ApiError(404, "Portfolio item not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Portfolio item deleted successfully"));
});


export {
    getAllPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
};