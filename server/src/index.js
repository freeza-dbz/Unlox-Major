import connectDB from "./db/index.js";
import { app } from "./app.js";


await connectDB()
.then(()=>{
    app.on("error", (err) =>{
        console.log("Error occured while starting the server: ", err.message);
        throw err;
    });

    const port = process.env.PORT;
    console.log(`Server is running on port ${port}`);
})
.catch((err) => {
    console.log("mongoDB connection failed: ", err);
    process.exit(1);
})