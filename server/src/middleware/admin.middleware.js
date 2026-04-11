import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
// import { User } from "../models/user.models";

export const verifyAdmin = asyncHandler(async(req, _, next) => {
    try {
        // console.log(req.user)

        const admin = req.user?.isAdmin;
        
        if(!admin){
            throw new ApiError(401, "Unauthorized request, you are not admin")
        }

        next()
    } catch (error) {
        throw new ApiError(401, error.message || "Unauthorized request")
    }
}) 