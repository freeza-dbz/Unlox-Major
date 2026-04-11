import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}))


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("cache"));
app.use(morgan("dev"));
app.use(helmet());

// routes import

import userRouter from "./routes/user.routes.js";

import testimonialRouter from "./routes/testimonial.routes.js";



// routes declaration

app.use("/api/v1/users", userRouter);

app.use("/api/v1/testimonials", testimonialRouter);


export { app };
