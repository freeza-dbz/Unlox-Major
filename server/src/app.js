import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";


const app = express();
dotenv.config()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("cache"));
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/v1/users", userRouter);

export { app }